use std::fs;
use std::path::Path;

use base64::{DecodeError, decode};
use serde_cbor::Value;
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

fn decode_attestation(attestation_data: &[u8]) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
    // Convert to string and trim any whitespace
    let attestation_str = std::str::from_utf8(attestation_data)?.trim();

    // Base64 decode
    let decoded_data = decode(attestation_str)?;

    // CBOR decode
    match serde_cbor::from_slice::<Value>(&decoded_data) {
        Ok(cbor_value) => {
            if let Value::Map(map) = &cbor_value {
                // Extract and print authData if it exists
                if let Some(auth_data) = map.get(&Value::Text("authData".to_string())) {
                    if let Value::Bytes(auth_data_bytes) = auth_data {
                        print_u8_arrays("authData", auth_data_bytes);
                    }
                }

                // Extract and print x5c certificates from attStmt if they exist
                if let Some(att_stmt) = map.get(&Value::Text("attStmt".to_string())) {
                    if let Value::Map(att_stmt_map) = att_stmt {
                        if let Some(x5c) = att_stmt_map.get(&Value::Text("x5c".to_string())) {
                            if let Value::Array(x5c_array) = x5c {
                                for (i, cert) in x5c_array.iter().enumerate() {
                                    if let Value::Bytes(cert_bytes) = cert {
                                        print_u8_arrays(&format!("x5c[{}]", i), cert_bytes);
                                    }
                                }
                            }
                        }
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
