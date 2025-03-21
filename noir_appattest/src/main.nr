use bigcurve::BigCurve;
use bignum::BigNum;
use bigcurve::curves::secp256r1::Secp256r1Fq;

pub global MAX_CERT_LENGTH: u32 = 1024;

fn main(
    root_cert: BoundedVec<u8, MAX_CERT_LENGTH>,
    intermediate_cert: BoundedVec<u8, MAX_CERT_LENGTH>,
    leaf_cert: BoundedVec<u8, MAX_CERT_LENGTH>,
    public_key_x: Secp256r1Fq,
    public_key_y: Secp256r1Fq
) {
    assert(root_cert.len() == intermediate_cert.len());
    assert(intermediate_cert.len() == leaf_cert.len());
}

#[test]
fn test_main() {
    let root_cert: BoundedVec<u8, MAX_CERT_LENGTH> = BoundedVec::from_array([1, 2, 3]);
    let intermediate_cert: BoundedVec<u8, MAX_CERT_LENGTH> = BoundedVec::from_array([1, 2, 3]);
    let leaf_cert: BoundedVec<u8, MAX_CERT_LENGTH> = BoundedVec::from_array([1, 2, 3]);

    let public_key_x: Secp256r1Fq = BigNum {
        limbs: [0xd54378ffd74c0a0692ea56dc91e14a, 0xa683ef4c166c55cfb8d135863fc8f9, 0xaa1d],
    };
    let public_key_y: Secp256r1Fq = BigNum {
        limbs: [0x6b6c3604db3440d3dc4ee95a24f0f0, 0xc4eae722e511eeb583122a0f6ab255, 0x4b36],
    };

    main(root_cert, intermediate_cert, leaf_cert, public_key_x, public_key_y);
}
