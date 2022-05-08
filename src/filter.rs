use image::{load_from_memory, imageops, DynamicImage};
use wasm_bindgen::JsError;

use crate::utils::{encode, Encoding};

pub fn blur(buffer: &[u8], sigma: f32, encoding: &Encoding) -> Result<Box<[u8]>, JsError> {
  let dyn_image = load_from_memory(buffer).map_err(|_| JsError::new("fail to load buffer"))?;
  let buffer = imageops::blur(&dyn_image, sigma);
  let result = encode(buffer, encoding).map_err(|_| {
    JsError::new("fail to encode")
  })?;
  Ok(result)
}

pub fn brighten(buffer: &[u8], value: i32, encoding: &Encoding) -> Result<Box<[u8]>, JsError> {
  let dyn_image = load_from_memory(buffer).map_err(|_| JsError::new("fail to load buffer"))?;
  let buffer = imageops::brighten(&dyn_image, value);
  let result = encode(buffer, encoding).map_err(|_| {
    JsError::new("fail to encode")
  })?;
  Ok(result)
}

pub fn contrast(buffer: &[u8], value: f32, encoding: &Encoding) -> Result<Box<[u8]>, JsError> {
  let dyn_image = load_from_memory(buffer).map_err(|_| JsError::new("fail to load buffer"))?;
  let buffer = imageops::contrast(&dyn_image, value);
  let result = encode(buffer, encoding).map_err(|_| {
    JsError::new("fail to encode")
  })?;
  Ok(result)
}

pub fn grayscale(buffer: &[u8], encoding: &Encoding) -> Result<Box<[u8]>, JsError> {
  let dyn_image = load_from_memory(buffer).map_err(|_| JsError::new("fail to load buffer"))?;
  let buffer = imageops::grayscale(&dyn_image);
  let result = encode(buffer, encoding).map_err(|_| {
    JsError::new("fail to encode")
  })?;
  Ok(result)
}

pub fn invert(buffer: &[u8], encoding: &Encoding) -> Result<Box<[u8]>, JsError> {
  let mut dyn_image = load_from_memory(buffer).map_err(|_| JsError::new("fail to load buffer"))?;
  imageops::invert(&mut dyn_image);
  let result: Box<[u8]>;
  match dyn_image {
    DynamicImage::ImageRgb8(buffer) => {
      result = encode(buffer, encoding).map_err(|_| {
        JsError::new("fail to encode")
      })?;
    },
    DynamicImage::ImageRgba8(buffer) => {
      result = encode(buffer, encoding).map_err(|_| {
        JsError::new("fail to encode")
      })?;
    },
    DynamicImage::ImageLuma8(buffer) => {
      result = encode(buffer, encoding).map_err(|_| {
        JsError::new("fail to encode")
      })?;
    },
    DynamicImage::ImageLumaA8(buffer) => {
      result = encode(buffer, encoding).map_err(|_| {
        JsError::new("fail to encode")
      })?;
    },
    _ => return Err(JsError::new("only support 8bit per channel"))
  }
  Ok(result)
}

pub fn hue_rotate(buffer: &[u8], angle: i32, encoding: &Encoding) -> Result<Box<[u8]>, JsError> {
  let dyn_image = load_from_memory(buffer).map_err(|_| JsError::new("fail to load buffer"))?;
  let buffer = imageops::huerotate(&dyn_image, angle);
  let result = encode(buffer, encoding).map_err(|_| {
    JsError::new("fail to encode")
  })?;
  Ok(result)
}

pub fn binarize(buffer: &[u8], threshold: u8, encoding: &Encoding) -> Result<Box<[u8]>, JsError> {
  let dyn_image = load_from_memory(buffer).map_err(|_| JsError::new("fail to load buffer"))?;
  let mut gray = dyn_image.into_luma8();
  for (_, _, p) in gray.enumerate_pixels_mut() {
    if p.0[0] <= threshold {
      p.0 = [0]
    }else {
      p.0 = [255]
    }
  };
  let result = encode(gray, encoding).map_err(|_| {
    JsError::new("fail to encode")
  })?;
  Ok(result)
}
