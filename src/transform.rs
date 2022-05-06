use image::{ imageops, load_from_memory, DynamicImage };
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
    let result: Box<[u8]>;
    match dyn_image {
        DynamicImage::ImageRgb8(image_buffer) => {
            let result_buffer = if angle == RotateAngle::_90 {
                imageops::rotate90(&image_buffer)
            }else {
                imageops::rotate270(&image_buffer)
            };
            result = encode(result_buffer, encoding).map_err(|_| {
                JsError::new("fail to encode")
            })?;
        },
        DynamicImage::ImageRgba8(image_buffer) => {
            let result_buffer = if angle == RotateAngle::_90 {
                imageops::rotate90(&image_buffer)
            }else {
                imageops::rotate270(&image_buffer)
            };
            result = encode(result_buffer, encoding).map_err(|_| {
                JsError::new("fail to encode")
            })?;
        },
        DynamicImage::ImageLuma8(image_buffer) => {
            let result_buffer = if angle == RotateAngle::_90 {
                imageops::rotate90(&image_buffer)
            }else {
                imageops::rotate270(&image_buffer)
            };
            result = encode(result_buffer, encoding).map_err(|_| {
                JsError::new("fail to encode")
            })?;
        },
        DynamicImage::ImageLumaA8(image_buffer) => {
            let result_buffer = if angle == RotateAngle::_90 {
                imageops::rotate90(&image_buffer)
            }else {
                imageops::rotate270(&image_buffer)
            };
            result = encode(result_buffer, encoding).map_err(|_| {
                JsError::new("fail to encode")
            })?;
        },
        _ => return Err(JsError::new("only support 8bit per channel"))
    };
    Ok(result)
}