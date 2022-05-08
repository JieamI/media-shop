use image::{ imageops, load_from_memory };
use image::imageops::FilterType;
use wasm_bindgen::prelude::*;
use crate::utils::{ encode, Encoding };

#[derive(PartialEq)]
pub enum RotateAngle {
  _90 = 90,
  _270 = 270
}

pub fn rotate(buffer: &[u8], angle: RotateAngle, encoding: &Encoding) -> Result<Box<[u8]>, JsError> {
  let dyn_image = load_from_memory(buffer).map_err(|_| {
    JsError::new("fail to load buffer")
  })?;
  let buffer = if angle == RotateAngle::_90 {
    imageops::rotate90(&dyn_image)
  }else {
    imageops::rotate270(&dyn_image)
  };
  let result = encode(buffer, encoding).map_err(|_| {
    JsError::new("fail to encode")
  })?;
  Ok(result)
}

pub fn resize(buffer: &[u8], width: u32, height: u32, filter: FilterType, encoding: &Encoding) -> Result<Box<[u8]>, JsError> {
  let dyn_image = load_from_memory(buffer).map_err(|_| {
    JsError::new("fail to load buffer")
  })?;
  let buffer = imageops::resize(&dyn_image, width, height, filter);
  let result = encode(buffer, encoding).map_err(|_| {
    JsError::new("fail to encode")
  })?;
  Ok(result)
}

pub fn flip_horizontal(buffer: &[u8], encoding: &Encoding) -> Result<Box<[u8]>, JsError> {
  let dyn_image = load_from_memory(buffer).map_err(|_| {
    JsError::new("fail to load buffer")
  })?;
  let buffer = imageops::flip_horizontal(&dyn_image);
  let result = encode(buffer, encoding).map_err(|_| {
    JsError::new("fail to encode")
  })?;
  Ok(result)
}

pub fn flip_vertical(buffer: &[u8], encoding: &Encoding) -> Result<Box<[u8]>, JsError> {
  let dyn_image = load_from_memory(buffer).map_err(|_| {
    JsError::new("fail to load buffer")
  })?;
  let buffer = imageops::flip_vertical(&dyn_image);
  let result = encode(buffer, encoding).map_err(|_| {
    JsError::new("fail to encode")
  })?;
  Ok(result)
}

