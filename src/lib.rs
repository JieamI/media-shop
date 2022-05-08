mod utils;
mod filter;
mod transform;
use image::{DynamicImage, load_from_memory};
use utils::Encoding;
use wasm_bindgen::prelude::*;

use crate::utils::encode;

#[wasm_bindgen]
extern {
  #[wasm_bindgen(js_namespace = console)]
  pub(crate) fn log(s: &str);
}

#[wasm_bindgen(start)]
pub fn main() {
  log("start!");
  utils::set_panic_hook();
}

#[wasm_bindgen]
pub struct Processor {
  buffer: Option<Box<[u8]>>,
  encoding: Encoding
}

#[wasm_bindgen]
impl Processor{
  #[wasm_bindgen(constructor)]
  pub fn new() -> Processor {
    Processor {
      buffer: None,
      encoding: Encoding::PNG
    }
  }

  pub fn set_buffer(&mut self, buffer: Box<[u8]>) {
    self.buffer = Some(buffer);
  }
  
  pub fn rotate_clock(&mut self, buffer: &[u8]) -> Result<Box<[u8]>, JsError> {
    transform::rotate(buffer, transform::RotateAngle::_90, &self.encoding)
  }
  
  pub fn rotate_anticlock(&self, buffer: &[u8]) -> Result<Box<[u8]>, JsError> {
    transform::rotate(buffer, transform::RotateAngle::_270, &self.encoding)
  }

  pub fn flip_horizontal(&self, buffer: &[u8]) -> Result<Box<[u8]>, JsError> {
    transform::flip_horizontal(buffer, &self.encoding)
  }

  pub fn flip_vertical(&self, buffer: &[u8]) -> Result<Box<[u8]>, JsError> {
    transform::flip_vertical(buffer, &self.encoding)
  }

  pub fn blur(&self, buffer: &[u8], sigma: f32) -> Result<Box<[u8]>, JsError> {
    filter::blur(buffer, sigma, &self.encoding)
  }

  pub fn resize(&self, buffer: &[u8], width: u32, height: u32) -> Result<Box<[u8]>, JsError> {
    transform::resize(buffer, width, height, image::imageops::FilterType::Nearest, &self.encoding)
  }

  pub fn brighten(&self, buffer: &[u8], value: i32) -> Result<Box<[u8]>, JsError> {
    filter::brighten(buffer, value, &self.encoding)
  }

  pub fn contrast(&self, buffer: &[u8], value: f32) -> Result<Box<[u8]>, JsError> {
    filter::contrast(buffer, value, &self.encoding)
  }

  pub fn grayscale(&self, buffer: &[u8]) -> Result<Box<[u8]>, JsError> {
    filter::grayscale(buffer, &self.encoding)
  }

  pub fn binarize(&self, buffer: &[u8], threshold: u8) -> Result<Box<[u8]>, JsError> {
    filter::binarize(buffer, threshold, &self.encoding)
  }

  pub fn invert(&self, buffer: &[u8]) -> Result<Box<[u8]>, JsError> {
    filter::invert(buffer, &self.encoding)
  }

  pub fn hue_rotate(&self, buffer: &[u8], angle: i32) -> Result<Box<[u8]>, JsError> {
    filter::hue_rotate(buffer, angle, &self.encoding)
  } 

  pub fn convert_format(&self, buffer: &[u8], format: Encoding) -> Result<Box<[u8]>, JsError>{
    let dyn_image = load_from_memory(buffer).map_err(|_| {
        JsError::new("fail to load buffer")
    })?;
    let result: Box<[u8]>;
    match dyn_image {
      DynamicImage::ImageRgb8(buffer) => {
        result = encode(buffer, &format).map_err(|_| {
          JsError::new("fail to encode")
        })?;
      },
      DynamicImage::ImageRgba8(buffer) => {
        result = encode(buffer, &format).map_err(|_| {
          JsError::new("fail to encode")
        })?;
      },
      DynamicImage::ImageLuma8(buffer) => {
        result = encode(buffer, &format).map_err(|_| {
          JsError::new("fail to encode")
        })?;
      },
      DynamicImage::ImageLumaA8(buffer) => {
        result = encode(buffer, &format).map_err(|_| {
          JsError::new("fail to encode")
        })?;
      },
      _ => return Err(JsError::new("only support 8bit per channel"))
    };
    Ok(result)
  }
}
