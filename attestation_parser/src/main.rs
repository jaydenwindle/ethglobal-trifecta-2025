use std::collections::BTreeMap;
use std::fs;
use std::io::{Read, Write};
use std::path::Path;

use base64::{DecodeError, decode};
use serde_cbor::Value;
use sha2::{Digest, Sha256, Sha512};
use toml::{Table, Value as TomlValue};
use x509_parser::pem::parse_x509_pem;
use x509_parser::prelude::*;

static APPLE_ROOT_PEM: &[u8] = include_bytes!("../apple-root-cert.pem");
static APPLE_DEMO_ATTESTATION: &[u8] = include_bytes!("../apple-demo-attestation.txt");

fn print_u8_arrays(label: &str, data: &[u8]) {
    println!("\n{} (length: {} bytes)", label, data.len());

    // Print as decimal u8 array
    println!("{} as u8 decimal array:", label);
    print!("[");
    for (i, byte) in data.iter().enumerate() {
        if i > 0 {
            print!(", ");
        }
        print!("{}", byte);
    }
    println!("]");

    // Print as string u8 array
    println!("{} as u8 string array:", label);
    print!("[");
    for (i, byte) in data.iter().enumerate() {
        if i > 0 {
            print!(", ");
        }
        print!("\"{}\"", byte);
    }
    println!("]");
}

fn update_prover_toml(
    root_cert: Option<&[u8]>,
    leaf_cert: Option<&[u8]>,
    intermediate_cert: Option<&[u8]>,
    auth_data: Option<&[u8]>,
) -> Result<(), Box<dyn std::error::Error>> {
    let prover_toml_path = "../noir_appattest/Prover.toml";

    // Read the existing TOML file
    let mut file = fs::File::open(prover_toml_path)?;
    let mut content = String::new();
    file.read_to_string(&mut content)?;

    // Parse the TOML content
    let mut toml_value: Table = toml::from_str(&content)?;

    // Update the root_cert if provided
    if let Some(cert_data) = root_cert {
        let mut root_cert_table = Table::new();
        root_cert_table.insert(
            "len".to_string(),
            TomlValue::String(cert_data.len().to_string()),
        );

        let storage: Vec<TomlValue> = cert_data
            .iter()
            .map(|b| TomlValue::String(b.to_string()))
            .collect();

        root_cert_table.insert("storage".to_string(), TomlValue::Array(storage));
        toml_value.insert("root_cert".to_string(), TomlValue::Table(root_cert_table));
    }

    // If root certificate is provided, extract and hash the TBS data
    if let Some(cert_data) = root_cert {
        // Parse the certificate to extract TBS data
        if let Ok((_, cert)) = parse_x509_certificate(cert_data) {
            // Get the TBS (To Be Signed) data
            let tbs_data = cert.tbs_certificate.as_ref();

            // Log TBS data as u8 array
            println!(
                "\nRoot certificate TBS data (length: {} bytes):",
                tbs_data.len()
            );
            println!("TBS data as u8 array:");
            print!("[");
            for (i, byte) in tbs_data.iter().enumerate() {
                if i > 0 {
                    print!(", ");
                }
                if i > 0 && i % 20 == 0 {
                    print!("\n ");
                }
                print!("{}", byte);
            }
            println!("]");

            // Calculate SHA-256 hash
            let mut hasher = Sha256::new();
            hasher.update(tbs_data);
            let tbs_hash = hasher.finalize();

            // Print hex representation of the hash
            println!("\nRoot certificate TBS SHA-256 hash (hex):");
            println!("{:x}", tbs_hash);

            // Print u8 array representation of the hash
            println!("\nRoot certificate TBS SHA-256 hash (u8 array):");
            print!("[");
            for (i, byte) in tbs_hash.iter().enumerate() {
                if i > 0 {
                    print!(", ");
                }
                print!("{}", byte);
            }
            println!("]");
        } else {
            println!("Failed to parse root certificate for TBS hashing");
        }
    }

    // Update the leaf_cert if provided
    if let Some(cert_data) = leaf_cert {
        let mut leaf_cert_table = Table::new();
        leaf_cert_table.insert(
            "len".to_string(),
            TomlValue::String(cert_data.len().to_string()),
        );

        let storage: Vec<TomlValue> = cert_data
            .iter()
            .map(|b| TomlValue::String(b.to_string()))
            .collect();

        leaf_cert_table.insert("storage".to_string(), TomlValue::Array(storage));
        toml_value.insert("leaf_cert".to_string(), TomlValue::Table(leaf_cert_table));
    }

    // Update the intermediate_cert if provided
    if let Some(cert_data) = intermediate_cert {
        let mut intermediate_cert_table = Table::new();
        intermediate_cert_table.insert(
            "len".to_string(),
            TomlValue::String(cert_data.len().to_string()),
        );

        let storage: Vec<TomlValue> = cert_data
            .iter()
            .map(|b| TomlValue::String(b.to_string()))
            .collect();

        intermediate_cert_table.insert("storage".to_string(), TomlValue::Array(storage));
        toml_value.insert(
            "intermediate_cert".to_string(),
            TomlValue::Table(intermediate_cert_table),
        );
    }

    // Update the auth_data if provided
    if let Some(auth_data_bytes) = auth_data {
        let mut auth_data_table = Table::new();
        auth_data_table.insert(
            "len".to_string(),
            TomlValue::String(auth_data_bytes.len().to_string()),
        );

        let storage: Vec<TomlValue> = auth_data_bytes
            .iter()
            .map(|b| TomlValue::String(b.to_string()))
            .collect();

        auth_data_table.insert("storage".to_string(), TomlValue::Array(storage));
        toml_value.insert("auth_data".to_string(), TomlValue::Table(auth_data_table));
    }

    // Write the updated TOML back to the file
    let toml_string = toml::to_string(&toml_value)?;
    let mut file = fs::File::create(prover_toml_path)?;
    file.write_all(toml_string.as_bytes())?;

    println!("\nSuccessfully updated {}", prover_toml_path);
    Ok(())
}

fn decode_attestation(attestation_data: &[u8]) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
    // Convert to string and trim any whitespace
    let attestation_str = std::str::from_utf8(attestation_data)?.trim();

    // Base64 decode
    let decoded_data = decode(attestation_str)?;

    // Variables to store the extracted data
    let mut auth_data_bytes = None;
    let mut leaf_cert = None;
    let mut intermediate_cert = None;

    // CBOR decode
    match serde_cbor::from_slice::<Value>(&decoded_data) {
        Ok(cbor_value) => {
            if let Value::Map(map) = &cbor_value {
                // Extract authData if it exists
                if let Some(Value::Bytes(auth_data)) = map.get(&Value::Text("authData".to_string()))
                {
                    print_u8_arrays("authData", auth_data);
                    auth_data_bytes = Some(auth_data.clone());
                }

                // Extract x5c certificates from attStmt if they exist
                if let Some(Value::Map(att_stmt_map)) = map.get(&Value::Text("attStmt".to_string()))
                {
                    if let Some(Value::Array(x5c_array)) =
                        att_stmt_map.get(&Value::Text("x5c".to_string()))
                    {
                        for (i, cert) in x5c_array.iter().enumerate() {
                            if let Value::Bytes(cert_bytes) = cert {
                                print_u8_arrays(&format!("x5c[{}]", i), cert_bytes);

                                // Store leaf and intermediate certificates
                                if i == 0 {
                                    leaf_cert = Some(cert_bytes.clone());
                                } else if i == 1 {
                                    intermediate_cert = Some(cert_bytes.clone());
                                }
                            }
                        }
                    }
                }

                // Update the Prover.toml file with the extracted data
                if auth_data_bytes.is_some() || leaf_cert.is_some() || intermediate_cert.is_some() {
                    if let Err(e) = update_prover_toml(
                        None, // We'll handle the root cert separately
                        leaf_cert.as_deref(),
                        intermediate_cert.as_deref(),
                        auth_data_bytes.as_deref(),
                    ) {
                        println!("Error updating Prover.toml: {}", e);
                    }
                }
            }
        }
        Err(e) => {
            println!("\nFailed to decode CBOR: {}", e);
        }
    }

    Ok(decoded_data)
}

fn main() {
    let cert_path = "apple-root-cert.pem";

    // Check if the certificate file exists
    if !Path::new(cert_path).exists() {
        eprintln!("Error: Certificate file '{}' not found", cert_path);
        return;
    }

    let res = parse_x509_pem(APPLE_ROOT_PEM);

    match res {
        Ok((rem, pem)) => {
            assert!(rem.is_empty());
            assert_eq!(pem.label, String::from("CERTIFICATE"));

            // Get the DER-encoded data from pem.contents
            let der_data = &pem.contents;

            // Print arrays of the DER-encoded certificate
            print_u8_arrays("DER-encoded certificate", der_data);

            // Update the root_cert in Prover.toml
            if let Err(e) = update_prover_toml(Some(der_data), None, None, None) {
                println!("Error updating root certificate in Prover.toml: {}", e);
            }

            // Parse the certificate to display information
            match parse_x509_certificate(der_data) {
                Ok((_, cert)) => {
                    println!("\nCertificate information:");
                    println!("Subject: {}", cert.subject());
                    println!("Issuer: {}", cert.issuer());
                    println!("Not before: {}", cert.validity().not_before);
                    println!("Not after: {}", cert.validity().not_after);
                }
                Err(e) => {
                    eprintln!("Warning: Could not parse certificate data: {:?}", e);
                }
            }
        }
        _ => panic!("PEM parsing failed: {:?}", res),
    }

    // Process the Apple Demo Attestation
    println!("\n\n========================================");
    println!("Processing Apple Demo Attestation");
    println!("========================================");

    match decode_attestation(APPLE_DEMO_ATTESTATION) {
        Ok(_) => {}
        Err(e) => println!("\nError decoding attestation: {}", e),
    }
}
