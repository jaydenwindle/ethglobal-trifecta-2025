use bigcurve::BigCurve;
use bignum::BigNum;
use bigcurve::curves::secp256r1::Secp256r1Fq;

pub global MAX_CERT_LENGTH: u32 = 1024;
pub global MAX_AUTHDATA_LENGTH: u32 = 1024;

struct Certificate {
    tbs_certificate: BoundedVec<u8, MAX_CERT_LENGTH>,
    signature_algorithm: BoundedVec<u8, MAX_CERT_LENGTH>,
    signature_value: BoundedVec<u8, MAX_CERT_LENGTH>,
}

fn parse_certificate(cert: BoundedVec<u8, MAX_CERT_LENGTH>) -> Certificate {
    // Ensure certificate starts with SEQUENCE tag (0x30)
    assert(cert.get(0) == 48);

    // Parse the certificate length according to ASN.1 DER encoding rules
    let length_byte = cert.get(1);
    let mut cert_content_start: u32 = 2; // Start position after tag and length byte
    let mut cert_length: u32 = 0;

    // Check if length is in long form (bit 7 is set)
    if (length_byte & 0x80) != 0 {
        // Long form: bits 6-0 encode the number of subsequent length bytes
        let length_bytes_count = length_byte & 0x7F;

        // Calculate the actual length from subsequent bytes
        cert_length = 0;
        for i in 0..length_bytes_count {
            if 2 + i as u32 < cert.len() {
                let len_byte = cert.get(2 + i as u32);
                cert_length = (cert_length << 8) | len_byte as u32;
            }
        }

        // Skip over these additional length bytes
        cert_content_start = cert_content_start + length_bytes_count as u32;
    } else {
        // Short form: length byte directly encodes the length
        cert_length = length_byte as u32;
    }

    // Ensure the certificate content fits within the certificate
    assert(cert_content_start + cert_length <= cert.len());

    // TBS Certificate starts at the beginning of the certificate content
    // It starts with 0x30 (SEQUENCE tag)
    assert(cert.get(cert_content_start) == 48);

    // Parse TBS Certificate length
    let tbs_length_byte = cert.get(cert_content_start + 1);
    let mut tbs_data_start: u32 = cert_content_start + 2; // Default for short form
    let mut tbs_length: u32 = 0;

    // Check if TBS length is in long form
    if (tbs_length_byte & 0x80) != 0 {
        let tbs_length_bytes_count = tbs_length_byte & 0x7F;

        // Calculate the actual length from subsequent bytes
        tbs_length = 0;
        for i in 0..tbs_length_bytes_count {
            if cert_content_start + 2 + i as u32 < cert.len() {
                let len_byte = cert.get(cert_content_start + 2 + i as u32);
                tbs_length = (tbs_length << 8) | len_byte as u32;
            }
        }

        // Update the start position of TBS data
        tbs_data_start = cert_content_start + 2 + tbs_length_bytes_count as u32;
    } else {
        // Short form: length byte directly encodes the length
        tbs_length = tbs_length_byte as u32;
    }

    // Ensure the TBS data fits within the certificate
    let tbs_end = tbs_data_start + tbs_length;
    assert(tbs_end <= cert.len());

    // Extract TBS data including the sequence tag and length bytes
    // This is critical for correctly validating the certificate hash
    let mut tbs_certificate: BoundedVec<u8, MAX_CERT_LENGTH> = BoundedVec::new();

    // Include the SEQUENCE tag and length bytes in the TBS certificate
    for i in 0..(tbs_end - cert_content_start) {
        if cert_content_start + i < cert.len() {
            tbs_certificate.push(cert.get(cert_content_start + i));
        }
    }

    // After TBS comes the signature algorithm
    let sig_alg_start = tbs_end;
    assert(sig_alg_start < cert.len());
    assert(cert.get(sig_alg_start) == 48); // SEQUENCE tag
    // Parse signature algorithm length
    let sig_alg_length_byte = cert.get(sig_alg_start + 1);
    let mut sig_alg_data_start: u32 = sig_alg_start + 2; // Default for short form
    let mut sig_alg_length: u32 = 0;

    // Check if signature algorithm length is in long form
    if (sig_alg_length_byte & 0x80) != 0 {
        let sig_alg_length_bytes_count = sig_alg_length_byte & 0x7F;

        // Calculate the actual length from subsequent bytes
        sig_alg_length = 0;
        for i in 0..sig_alg_length_bytes_count {
            if sig_alg_start + 2 + i as u32 < cert.len() {
                let len_byte = cert.get(sig_alg_start + 2 + i as u32);
                sig_alg_length = (sig_alg_length << 8) | len_byte as u32;
            }
        }

        // Update the start position of signature algorithm data
        sig_alg_data_start = sig_alg_start + 2 + sig_alg_length_bytes_count as u32;
    } else {
        // Short form: length byte directly encodes the length
        sig_alg_length = sig_alg_length_byte as u32;
    }

    // Ensure the signature algorithm data fits within the certificate
    let sig_alg_end = sig_alg_data_start + sig_alg_length;
    assert(sig_alg_end <= cert.len());

    // Extract signature algorithm data including the sequence tag and length bytes
    let mut signature_algorithm: BoundedVec<u8, MAX_CERT_LENGTH> = BoundedVec::new();

    // Include the SEQUENCE tag and length bytes in the signature algorithm
    for i in 0..(sig_alg_end - sig_alg_start) {
        if sig_alg_start + i < cert.len() {
            signature_algorithm.push(cert.get(sig_alg_start + i));
        }
    }

    // After signature algorithm comes the signature value
    let sig_val_start = sig_alg_end;
    assert(sig_val_start < cert.len());
    assert(cert.get(sig_val_start) == 3); // BIT STRING tag (0x03)
    // Parse signature value length
    let sig_val_length_byte = cert.get(sig_val_start + 1);
    let mut sig_val_data_start: u32 = sig_val_start + 2; // Default for short form
    let mut sig_val_length: u32 = 0;

    // Check if signature value length is in long form
    if (sig_val_length_byte & 0x80) != 0 {
        let sig_val_length_bytes_count = sig_val_length_byte & 0x7F;

        // Calculate the actual length from subsequent bytes
        sig_val_length = 0;
        for i in 0..sig_val_length_bytes_count {
            if sig_val_start + 2 + i as u32 < cert.len() {
                let len_byte = cert.get(sig_val_start + 2 + i as u32);
                sig_val_length = (sig_val_length << 8) | len_byte as u32;
            }
        }

        // Update the start position of signature value data
        sig_val_data_start = sig_val_start + 2 + sig_val_length_bytes_count as u32;
    } else {
        // Short form: length byte directly encodes the length
        sig_val_length = sig_val_length_byte as u32;
    }

    // Ensure the signature value data fits within the certificate
    let sig_val_end = sig_val_data_start + sig_val_length;
    assert(sig_val_end <= cert.len());

    // Extract signature value data including the BIT STRING tag and length bytes
    let mut signature_value: BoundedVec<u8, MAX_CERT_LENGTH> = BoundedVec::new();

    // Include the BIT STRING tag and length bytes in the signature value
    for i in 0..(sig_val_end - sig_val_start) {
        if sig_val_start + i < cert.len() {
            signature_value.push(cert.get(sig_val_start + i));
        }
    }

    Certificate { tbs_certificate, signature_algorithm, signature_value }
}

// Checks if the bytes of a certificate algorithm match a given OID
// OID string format example: "1.2.840.10045.4.3.2" for ECDSA with SHA256
fn check_algorithm_oid(algorithm_bytes: BoundedVec<u8, MAX_CERT_LENGTH>, oid_string: str<100>) -> bool {
    // Ensure algorithm starts with SEQUENCE tag (0x30)
    if algorithm_bytes.len() < 2 || algorithm_bytes.get(0) != 48 {
        return false;
    }
    
    // Skip the SEQUENCE tag and length bytes to get to the OID
    let length_byte = algorithm_bytes.get(1);
    let mut oid_start: u32 = 2; // Default position after tag and length byte
    
    // Check if length is in long form (bit 7 is set)
    if (length_byte & 0x80) != 0 {
        // Long form: bits 6-0 encode the number of subsequent length bytes
        let length_bytes_count = length_byte & 0x7F;
        // Skip over these additional length bytes
        oid_start = oid_start + length_bytes_count as u32;
    }
    
    // The OID should start with OID tag (0x06)
    if oid_start >= algorithm_bytes.len() || algorithm_bytes.get(oid_start) != 6 {
        return false;
    }
    
    // Get the length of the OID value
    let oid_length_byte = algorithm_bytes.get(oid_start + 1);
    let mut oid_value_start: u32 = oid_start + 2; // Default for short form
    let mut oid_length: u32 = 0;
    
    // Check if OID length is in long form
    if (oid_length_byte & 0x80) != 0 {
        let oid_length_bytes_count = oid_length_byte & 0x7F;
        
        // Calculate the actual length from subsequent bytes
        oid_length = 0;
        for i in 0..oid_length_bytes_count {
            if oid_start + 2 + i as u32 < algorithm_bytes.len() {
                let len_byte = algorithm_bytes.get(oid_start + 2 + i as u32);
                oid_length = (oid_length << 8) | len_byte as u32;
            }
        }
        
        // Update the start position of OID value
        oid_value_start = oid_start + 2 + oid_length_bytes_count as u32;
    } else {
        // Short form: length byte directly encodes the length
        oid_length = oid_length_byte as u32;
    }
    
    // Ensure the OID value fits within the algorithm bytes
    if oid_value_start + oid_length > algorithm_bytes.len() {
        return false;
    }
    
    // Extract the OID value bytes
    let mut oid_value: BoundedVec<u8, MAX_CERT_LENGTH> = BoundedVec::new();
    for i in 0..oid_length {
        if oid_value_start + i < algorithm_bytes.len() {
            oid_value.push(algorithm_bytes.get(oid_value_start + i));
        }
    }
    
    // Convert the OID bytes to a string representation
    // First two nodes are encoded in the first byte: first_byte = 40*x + y
    let mut oid_str = "";
    if oid_value.len() > 0 {
        let first_byte = oid_value.get(0);
        let x = first_byte / 40;
        let y = first_byte % 40;
        
        oid_str = format!("{}.{}", x, y);
        
        // Process remaining bytes
        let mut value: u32 = 0;
        for i in 1..oid_value.len() {
            let b = oid_value.get(i);
            
            // Check if this is a continuation byte (bit 7 is set)
            if (b & 0x80) != 0 {
                // This is a multi-byte value
                value = (value << 7) | (b & 0x7F) as u32;
            } else {
                // This is the last byte of the value
                value = (value << 7) | b as u32;
                
                // Append this value to the OID string
                oid_str = format!("{}.{}", oid_str, value);
                
                // Reset for the next value
                value = 0;
            }
        }
    }
    
    // Compare the constructed OID string with the provided one
    oid_str == oid_string
}

fn main(
    root_cert: BoundedVec<u8, MAX_CERT_LENGTH>,
    intermediate_cert: BoundedVec<u8, MAX_CERT_LENGTH>,
    leaf_cert: BoundedVec<u8, MAX_CERT_LENGTH>,
    auth_data: BoundedVec<u8, MAX_AUTHDATA_LENGTH>,
    public_key_x: Secp256r1Fq,
    public_key_y: Secp256r1Fq,
) {
    assert(root_cert.len() > 0);
    assert(intermediate_cert.len() > 0);
    assert(leaf_cert.len() > 0);
    assert(auth_data.len() > 0);

    // Parse the root certificate into its components
    let parsed_root_cert = parse_certificate(root_cert);

    // Print the TBS certificate data
    println(parsed_root_cert.tbs_certificate);

    // Verify TBS data is not empty
    assert(parsed_root_cert.tbs_certificate.len() > 0);

    // Calculate the hash of the TBS certificate
    let tbs_hash = std::sha256::sha256_var(
        parsed_root_cert.tbs_certificate.storage(),
        parsed_root_cert.tbs_certificate.len() as u64,
    );

    println(parsed_root_cert.signature_algorithm);
    println(parsed_root_cert.signature_value);
    println(tbs_hash);
    
    // Check if the root certificate uses ECDSA with SHA-384
    let is_ecdsa_sha384 = check_algorithm_oid(parsed_root_cert.signature_algorithm, "1.2.840.10045.4.3.3");
    println(is_ecdsa_sha384);
    
    // We can also parse the intermediate and leaf certificates if needed
    // let parsed_intermediate_cert = parse_certificate(intermediate_cert);
    // let parsed_leaf_cert = parse_certificate(leaf_cert);
}

#[test]
fn test_main() {
    let root_cert: BoundedVec<u8, MAX_CERT_LENGTH> = BoundedVec::from_array([
        48, 130, 2, 33, 48, 130, 1, 167, 160, 3, 2, 1, 2, 2, 16, 11, 243, 190, 14, 241, 205, 210,
        224, 251, 140, 110, 114, 31, 98, 23, 152, 48, 10, 6, 8, 42, 134, 72, 206, 61, 4, 3, 3, 48,
        82, 49, 38, 48, 36, 6, 3, 85, 4, 3, 12, 29, 65, 112, 112, 108, 101, 32, 65, 112, 112, 32,
        65, 116, 116, 101, 115, 116, 97, 116, 105, 111, 110, 32, 82, 111, 111, 116, 32, 67, 65, 49,
        19, 48, 17, 6, 3, 85, 4, 10, 12, 10, 65, 112, 112, 108, 101, 32, 73, 110, 99, 46, 49, 19,
        48, 17, 6, 3, 85, 4, 8, 12, 10, 67, 97, 108, 105, 102, 111, 114, 110, 105, 97, 48, 30, 23,
        13, 50, 48, 48, 51, 49, 56, 49, 56, 51, 50, 53, 51, 90, 23, 13, 52, 53, 48, 51, 49, 53, 48,
        48, 48, 48, 48, 48, 90, 48, 82, 49, 38, 48, 36, 6, 3, 85, 4, 3, 12, 29, 65, 112, 112, 108,
        101, 32, 65, 112, 112, 32, 65, 116, 116, 101, 115, 116, 97, 116, 105, 111, 110, 32, 82, 111,
        111, 116, 32, 67, 65, 49, 19, 48, 17, 6, 3, 85, 4, 10, 12, 10, 65, 112, 112, 108, 101, 32,
        73, 110, 99, 46, 49, 19, 48, 17, 6, 3, 85, 4, 8, 12, 10, 67, 97, 108, 105, 102, 111, 114,
        110, 105, 97, 48, 118, 48, 16, 6, 7, 42, 134, 72, 206, 61, 2, 1, 6, 5, 43, 129, 4, 0, 34, 3,
        98, 0, 4, 69, 49, 225, 152, 181, 180, 236, 4, 218, 21, 2, 4, 87, 4, 237, 79, 135, 114, 114,
        215, 97, 53, 178, 97, 22, 207, 200, 139, 97, 93, 10, 0, 7, 25, 186, 105, 133, 141, 254, 119,
        202, 163, 184, 57, 224, 32, 221, 214, 86, 20, 20, 4, 112, 40, 49, 228, 63, 112, 184, 143,
        214, 195, 148, 182, 8, 234, 43, 214, 174, 97, 233, 245, 152, 193, 47, 70, 175, 82, 147, 114,
        102, 229, 127, 20, 235, 97, 254, 197, 48, 247, 20, 79, 83, 129, 46, 53, 163, 66, 48, 64, 48,
        15, 6, 3, 85, 29, 19, 1, 1, 255, 4, 5, 48, 3, 1, 1, 255, 48, 29, 6, 3, 85, 29, 14, 4, 22, 4,
        20, 172, 145, 16, 83, 51, 189, 190, 104, 65, 255, 167, 12, 169, 229, 250, 234, 229, 229,
        138, 161, 48, 14, 6, 3, 85, 29, 15, 1, 1, 255, 4, 4, 3, 2, 1, 6, 48, 10, 6, 8, 42, 134, 72,
        206, 61, 4, 3, 3, 3, 104, 0, 48, 101, 2, 48, 66, 1, 70, 156, 28, 175, 178, 37, 91, 165, 50,
        176, 74, 6, 180, 144, 253, 30, 240, 71, 131, 75, 143, 172, 66, 100, 239, 111, 187, 231, 231,
        115, 185, 248, 84, 87, 129, 226, 225, 164, 157, 58, 202, 192, 185, 62, 179, 178, 2, 49, 0,
        167, 149, 56, 196, 56, 4, 130, 89, 69, 236, 73, 247, 85, 193, 55, 137, 236, 89, 102, 210,
        158, 98, 122, 106, 182, 40, 213, 163, 33, 107, 105, 101, 72, 201, 223, 221, 129, 169, 230,
        173, 219, 130, 213, 185, 147, 4, 108, 3,
    ]);
    let intermediate_cert: BoundedVec<u8, MAX_CERT_LENGTH> = BoundedVec::from_array([
        48, 130, 2, 67, 48, 130, 1, 200, 160, 3, 2, 1, 2, 2, 16, 9, 186, 197, 225, 188, 64, 26, 217,
        212, 83, 149, 188, 56, 26, 8, 84, 48, 10, 6, 8, 42, 134, 72, 206, 61, 4, 3, 3, 48, 82, 49,
        38, 48, 36, 6, 3, 85, 4, 3, 12, 29, 65, 112, 112, 108, 101, 32, 65, 112, 112, 32, 65, 116,
        116, 101, 115, 116, 97, 116, 105, 111, 110, 32, 82, 111, 111, 116, 32, 67, 65, 49, 19, 48,
        17, 6, 3, 85, 4, 10, 12, 10, 65, 112, 112, 108, 101, 32, 73, 110, 99, 46, 49, 19, 48, 17, 6,
        3, 85, 4, 8, 12, 10, 67, 97, 108, 105, 102, 111, 114, 110, 105, 97, 48, 30, 23, 13, 50, 48,
        48, 51, 49, 56, 49, 56, 51, 57, 53, 53, 90, 23, 13, 51, 48, 48, 51, 49, 51, 48, 48, 48, 48,
        48, 48, 90, 48, 79, 49, 35, 48, 33, 6, 3, 85, 4, 3, 12, 26, 65, 112, 112, 108, 101, 32, 65,
        112, 112, 32, 65, 116, 116, 101, 115, 116, 97, 116, 105, 111, 110, 32, 67, 65, 32, 49, 49,
        19, 48, 17, 6, 3, 85, 4, 10, 12, 10, 65, 112, 112, 108, 101, 32, 73, 110, 99, 46, 49, 19,
        48, 17, 6, 3, 85, 4, 8, 12, 10, 67, 97, 108, 105, 102, 111, 114, 110, 105, 97, 48, 118, 48,
        16, 6, 7, 42, 134, 72, 206, 61, 2, 1, 6, 5, 43, 129, 4, 0, 34, 3, 98, 0, 4, 174, 91, 55,
        160, 119, 77, 121, 178, 53, 143, 64, 231, 209, 242, 38, 38, 241, 194, 95, 239, 23, 128, 45,
        234, 179, 130, 106, 89, 135, 79, 248, 210, 173, 21, 37, 120, 154, 162, 102, 4, 25, 18, 72,
        182, 60, 185, 103, 6, 158, 152, 211, 99, 189, 94, 55, 15, 191, 160, 142, 50, 158, 128, 115,
        169, 133, 231, 116, 110, 163, 89, 162, 246, 111, 41, 219, 50, 175, 69, 94, 33, 22, 88, 213,
        103, 175, 158, 38, 126, 178, 97, 77, 194, 26, 102, 206, 153, 163, 102, 48, 100, 48, 18, 6,
        3, 85, 29, 19, 1, 1, 255, 4, 8, 48, 6, 1, 1, 255, 2, 1, 0, 48, 31, 6, 3, 85, 29, 35, 4, 24,
        48, 22, 128, 20, 172, 145, 16, 83, 51, 189, 190, 104, 65, 255, 167, 12, 169, 229, 250, 234,
        229, 229, 138, 161, 48, 29, 6, 3, 85, 29, 14, 4, 22, 4, 20, 62, 227, 93, 28, 4, 25, 169,
        201, 180, 49, 248, 132, 116, 214, 225, 225, 87, 114, 227, 155, 48, 14, 6, 3, 85, 29, 15, 1,
        1, 255, 4, 4, 3, 2, 1, 6, 48, 10, 6, 8, 42, 134, 72, 206, 61, 4, 3, 3, 3, 105, 0, 48, 102,
        2, 49, 0, 187, 190, 136, 141, 115, 141, 5, 2, 207, 188, 253, 102, 109, 9, 87, 80, 53, 188,
        214, 135, 44, 63, 132, 48, 73, 38, 41, 237, 209, 249, 20, 232, 121, 153, 28, 154, 232, 181,
        174, 248, 211, 168, 84, 51, 247, 182, 13, 6, 2, 49, 0, 171, 56, 237, 208, 204, 129, 237, 0,
        164, 82, 195, 186, 68, 249, 147, 99, 101, 83, 254, 204, 41, 127, 46, 180, 223, 159, 94, 190,
        90, 74, 202, 182, 153, 92, 75, 130, 13, 249, 4, 56, 111, 120, 7, 187, 88, 148, 57, 183,
    ]);
    let leaf_cert: BoundedVec<u8, MAX_CERT_LENGTH> = BoundedVec::from_array([
        48, 130, 3, 178, 48, 130, 3, 57, 160, 3, 2, 1, 2, 2, 6, 1, 142, 241, 253, 77, 74, 48, 10, 6,
        8, 42, 134, 72, 206, 61, 4, 3, 2, 48, 79, 49, 35, 48, 33, 6, 3, 85, 4, 3, 12, 26, 65, 112,
        112, 108, 101, 32, 65, 112, 112, 32, 65, 116, 116, 101, 115, 116, 97, 116, 105, 111, 110,
        32, 67, 65, 32, 49, 49, 19, 48, 17, 6, 3, 85, 4, 10, 12, 10, 65, 112, 112, 108, 101, 32, 73,
        110, 99, 46, 49, 19, 48, 17, 6, 3, 85, 4, 8, 12, 10, 67, 97, 108, 105, 102, 111, 114, 110,
        105, 97, 48, 30, 23, 13, 50, 52, 48, 52, 49, 55, 49, 54, 49, 52, 53, 51, 90, 23, 13, 50, 52,
        48, 52, 50, 48, 49, 54, 49, 52, 53, 51, 90, 48, 129, 145, 49, 73, 48, 71, 6, 3, 85, 4, 3,
        12, 64, 54, 100, 50, 97, 99, 52, 56, 52, 53, 102, 49, 51, 50, 51, 51, 50, 50, 102, 53, 57,
        50, 51, 102, 48, 98, 100, 57, 100, 50, 50, 100, 98, 101, 53, 48, 101, 48, 54, 98, 55, 98,
        56, 48, 49, 50, 49, 102, 99, 101, 50, 98, 50, 98, 53, 101, 54, 54, 101, 57, 101, 57, 56,
        100, 54, 49, 26, 48, 24, 6, 3, 85, 4, 11, 12, 17, 65, 65, 65, 32, 67, 101, 114, 116, 105,
        102, 105, 99, 97, 116, 105, 111, 110, 49, 19, 48, 17, 6, 3, 85, 4, 10, 12, 10, 65, 112, 112,
        108, 101, 32, 73, 110, 99, 46, 49, 19, 48, 17, 6, 3, 85, 4, 8, 12, 10, 67, 97, 108, 105,
        102, 111, 114, 110, 105, 97, 48, 89, 48, 19, 6, 7, 42, 134, 72, 206, 61, 2, 1, 6, 8, 42,
        134, 72, 206, 61, 3, 1, 7, 3, 66, 0, 4, 140, 46, 12, 171, 111, 146, 35, 151, 14, 127, 90,
        182, 233, 47, 215, 164, 214, 214, 33, 166, 14, 84, 134, 68, 191, 25, 118, 78, 241, 239, 133,
        54, 17, 246, 194, 182, 187, 83, 178, 187, 162, 211, 70, 129, 151, 228, 190, 171, 44, 54,
        202, 192, 228, 226, 79, 65, 243, 81, 50, 201, 71, 94, 92, 36, 163, 130, 1, 188, 48, 130, 1,
        184, 48, 12, 6, 3, 85, 29, 19, 1, 1, 255, 4, 2, 48, 0, 48, 14, 6, 3, 85, 29, 15, 1, 1, 255,
        4, 4, 3, 2, 4, 240, 48, 129, 136, 6, 9, 42, 134, 72, 134, 247, 99, 100, 8, 5, 4, 123, 48,
        121, 164, 3, 2, 1, 10, 191, 137, 48, 3, 2, 1, 1, 191, 137, 49, 3, 2, 1, 0, 191, 137, 50, 3,
        2, 1, 1, 191, 137, 51, 3, 2, 1, 1, 191, 137, 52, 41, 4, 39, 48, 51, 53, 50, 49, 56, 55, 51,
        57, 49, 46, 99, 111, 109, 46, 97, 112, 112, 108, 101, 46, 101, 120, 97, 109, 112, 108, 101,
        95, 97, 112, 112, 95, 97, 116, 116, 101, 115, 116, 165, 6, 4, 4, 115, 107, 115, 32, 191,
        137, 54, 3, 2, 1, 5, 191, 137, 55, 3, 2, 1, 0, 191, 137, 57, 3, 2, 1, 0, 191, 137, 58, 3, 2,
        1, 0, 191, 137, 59, 3, 2, 1, 0, 48, 129, 215, 6, 9, 42, 134, 72, 134, 247, 99, 100, 8, 7, 4,
        129, 201, 48, 129, 198, 191, 138, 120, 6, 4, 4, 49, 56, 46, 48, 191, 136, 80, 7, 2, 5, 0,
        255, 255, 255, 255, 191, 138, 123, 9, 4, 7, 50, 50, 65, 50, 52, 52, 98, 191, 138, 124, 6, 4,
        4, 49, 56, 46, 48, 191, 138, 125, 6, 4, 4, 49, 56, 46, 48, 191, 138, 126, 3, 2, 1, 0, 191,
        138, 127, 3, 2, 1, 0, 191, 139, 0, 3, 2, 1, 0, 191, 139, 1, 3, 2, 1, 0, 191, 139, 2, 3, 2,
        1, 0, 191, 139, 3, 3, 2, 1, 0, 191, 139, 4, 3, 2, 1, 1, 191, 139, 5, 3, 2, 1, 0, 191, 139,
        10, 16, 4, 14, 50, 50, 46, 49, 46, 50, 52, 52, 46, 48, 46, 50, 44, 48, 191, 139, 11, 16, 4,
        14, 50, 50, 46, 49, 46, 50, 52, 52, 46, 48, 46, 50, 44, 48, 191, 139, 12, 16, 4, 14, 50, 50,
        46, 49, 46, 50, 52, 52, 46, 48, 46, 50, 44, 48, 191, 136, 2, 10, 4, 8, 105, 112, 104, 111,
        110, 101, 111, 115, 191, 136, 5, 10, 4, 8, 73, 110, 116, 101, 114, 110, 97, 108, 48, 51, 6,
        9, 42, 134, 72, 134, 247, 99, 100, 8, 2, 4, 38, 48, 36, 161, 34, 4, 32, 251, 109, 22, 42,
        113, 126, 202, 177, 119, 137, 0, 80, 111, 169, 77, 103, 238, 12, 29, 195, 212, 91, 18, 205,
        222, 129, 190, 252, 86, 229, 183, 235, 48, 10, 6, 8, 42, 134, 72, 206, 61, 4, 3, 2, 3, 103,
        0, 48, 100, 2, 48, 34, 78, 47, 30, 90, 2, 235, 128, 178, 27, 188, 100, 234, 97, 2, 219, 3,
        100, 226, 17, 111, 248, 42, 242, 7, 16, 147, 138, 177, 184, 100, 231, 81, 130, 237, 2, 174,
        241, 110, 143, 124, 208, 18, 107, 75, 13, 71, 182, 2, 48, 2, 139, 102, 30, 108, 44, 178,
        206, 23, 124, 3, 1, 245, 134, 242, 224, 34, 186, 102, 50, 61, 128, 38, 44, 180, 138, 207,
        89, 228, 226, 195, 98, 76, 253, 4, 213, 23, 208, 128, 86, 24, 153, 94, 194, 167, 107, 218,
        37,
    ]);
    let auth_data: BoundedVec<u8, MAX_CERT_LENGTH> = BoundedVec::from_array([
        21, 88, 64, 51, 201, 80, 185, 254, 157, 81, 76, 226, 162, 17, 163, 38, 215, 26, 166, 177, 1,
        74, 180, 198, 250, 47, 189, 169, 217, 170, 24, 166, 64, 0, 0, 0, 0, 97, 112, 112, 97, 116,
        116, 101, 115, 116, 0, 0, 0, 0, 0, 0, 0, 0, 32, 109, 42, 196, 132, 95, 19, 35, 50, 47, 89,
        35, 240, 189, 157, 34, 219, 229, 14, 6, 183, 184, 1, 33, 252, 226, 178, 181, 230, 110, 158,
        152, 214, 165, 1, 2, 3, 38, 32, 1, 33, 88, 32, 140, 46, 12, 171, 111, 146, 35, 151, 14, 127,
        90, 182, 233, 47, 215, 164, 214, 214, 33, 166, 14, 84, 134, 68, 191, 25, 118, 78, 241, 239,
        133, 54, 34, 88, 32, 17, 246, 194, 182, 187, 83, 178, 187, 162, 211, 70, 129, 151, 228, 190,
        171, 44, 54, 202, 192, 228, 226, 79, 65, 243, 81, 50, 201, 71, 94, 92, 36,
    ]);

    let public_key_x: Secp256r1Fq = BigNum {
        limbs: [0xd54378ffd74c0a0692ea56dc91e14a, 0xa683ef4c166c55cfb8d135863fc8f9, 0xaa1d],
    };
    let public_key_y: Secp256r1Fq = BigNum {
        limbs: [0x6b6c3604db3440d3dc4ee95a24f0f0, 0xc4eae722e511eeb583122a0f6ab255, 0x4b36],
    };

    let root_cert_tbs_hash = [
        223, 198, 223, 34, 250, 148, 131, 144, 75, 22, 247, 119, 252, 86, 110, 1, 7, 181, 82, 52,
        110, 206, 68, 191, 94, 67, 120, 110, 69, 209, 226, 89,
    ];
    let root_cert_tbs = [
        48, 130, 1, 167, 160, 3, 2, 1, 2, 2, 16, 11, 243, 190, 14, 241, 205, 210, 224, 251, 140,
        110, 114, 31, 98, 23, 152, 48, 10, 6, 8, 42, 134, 72, 206, 61, 4, 3, 3, 48, 82, 49, 38, 48,
        36, 6, 3, 85, 4, 3, 12, 29, 65, 112, 112, 108, 101, 32, 65, 112, 112, 32, 65, 116, 116, 101,
        115, 116, 97, 116, 105, 111, 110, 32, 82, 111, 111, 116, 32, 67, 65, 49, 19, 48, 17, 6, 3,
        85, 4, 10, 12, 10, 65, 112, 112, 108, 101, 32, 73, 110, 99, 46, 49, 19, 48, 17, 6, 3, 85, 4,
        8, 12, 10, 67, 97, 108, 105, 102, 111, 114, 110, 105, 97, 48, 30, 23, 13, 50, 48, 48, 51,
        49, 56, 49, 56, 51, 50, 53, 51, 90, 23, 13, 52, 53, 48, 51, 49, 53, 48, 48, 48, 48, 48, 48,
        90, 48, 82, 49, 38, 48, 36, 6, 3, 85, 4, 3, 12, 29, 65, 112, 112, 108, 101, 32, 65, 112,
        112, 32, 65, 116, 116, 101, 115, 116, 97, 116, 105, 111, 110, 32, 82, 111, 111, 116, 32, 67,
        65, 49, 19, 48, 17, 6, 3, 85, 4, 10, 12, 10, 65, 112, 112, 108, 101, 32, 73, 110, 99, 46,
        49, 19, 48, 17, 6, 3, 85, 4, 8, 12, 10, 67, 97, 108, 105, 102, 111, 114, 110, 105, 97, 48,
        118, 48, 16, 6, 7, 42, 134, 72, 206, 61, 2, 1, 6, 5, 43, 129, 4, 0, 34, 3, 98, 0, 4, 69, 49,
        225, 152, 181, 180, 236, 4, 218, 21, 2, 4, 87, 4, 237, 79, 135, 114, 114, 215, 97, 53, 178,
        97, 22, 207, 200, 139, 97, 93, 10, 0, 7, 25, 186, 105, 133, 141, 254, 119, 202, 163, 184,
        57, 224, 32, 221, 214, 86, 20, 20, 4, 112, 40, 49, 228, 63, 112, 184, 143, 214, 195, 148,
        182, 8, 234, 43, 214, 174, 97, 233, 245, 152, 193, 47, 70, 175, 82, 147, 114, 102, 229, 127,
        20, 235, 97, 254, 197, 48, 247, 20, 79, 83, 129, 46, 53, 163, 66, 48, 64, 48, 15, 6, 3, 85,
        29, 19, 1, 1, 255, 4, 5, 48, 3, 1, 1, 255, 48, 29, 6, 3, 85, 29, 14, 4, 22, 4, 20, 172, 145,
        16, 83, 51, 189, 190, 104, 65, 255, 167, 12, 169, 229, 250, 234, 229, 229, 138, 161, 48, 14,
        6, 3, 85, 29, 15, 1, 1, 255, 4, 4, 3, 2, 1, 6,
    ];

    println(root_cert_tbs.len());

    main(
        root_cert,
        intermediate_cert,
        leaf_cert,
        auth_data,
        public_key_x,
        public_key_y,
    );
}
