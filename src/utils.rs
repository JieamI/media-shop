use std::ops::Deref;
use image::{ImageBuffer, Pixel, ImageEncoder, ImageError, PixelWithColorType};
use image::codecs::{bmp::BmpEncoder, jpeg::JpegEncoder, png::PngEncoder};
use wasm_bindgen::prelude::wasm_bindgen;

use crate::log;

pub fn set_panic_hook() {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function at least once during initialization, and then
    // we will get better error messages if our code ever panics.
    //
    // For more details see
    // https://github.com/rustwasm/console_error_panic_hook#readme
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
pub enum Encoding {
    JPEG,
    PNG,
    BMP
}

pub fn encode<P, Container>(buffer: ImageBuffer<P, Container>, encoding: &Encoding) -> Result<Box<[u8]>, ImageError>
where
    P:Pixel<Subpixel = u8> + PixelWithColorType,    
    Container: Deref<Target = [P::Subpixel]>,
{
    let mut result = Vec::<u8>::new();
    let width = buffer.width();
    let height = buffer.height();
    match encoding {
        Encoding::PNG => {
            let encoder = PngEncoder::new(&mut result);
            encoder.write_image(&buffer, width, height, P::COLOR_TYPE)?;
        },
        Encoding::JPEG => {
            log("match jpeg");
            let encoder = JpegEncoder::new(&mut result);
            log("initial encoder");
            encoder.write_image(&buffer, width, height, P::COLOR_TYPE)?;
            log("encode success");
        },
        Encoding::BMP => {
            let encoder = BmpEncoder::new(&mut result);
            encoder.write_image(&buffer, width, height, P::COLOR_TYPE)?;
        }
    };
    Ok(result.into_boxed_slice())
}


