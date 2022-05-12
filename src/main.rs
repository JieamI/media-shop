#![allow(dead_code)]

use std::fs::File;
use std::io::Write;
use std::ops::Deref;
use std::time::{ SystemTime };
use image::{load_from_memory, DynamicImage, imageops};
use image::{ImageBuffer, Pixel, ImageEncoder, ImageError, PixelWithColorType};
use image::codecs::{bmp::BmpEncoder, jpeg::JpegEncoder, png::PngEncoder, ico::IcoEncoder};

enum Encoding {
  JPEG,
  PNG,
  BMP,
  ICO
}

fn encode<P, Container>(buffer: ImageBuffer<P, Container>, encoding: &Encoding) -> Result<Box<[u8]>, ImageError>
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
      let encoder = JpegEncoder::new(&mut result);
      encoder.write_image(&buffer, width, height, P::COLOR_TYPE)?;
    },
    Encoding::BMP => {
      let encoder = BmpEncoder::new(&mut result);
      encoder.write_image(&buffer, width, height, P::COLOR_TYPE)?;
    },
    Encoding::ICO => {
      let encoder = IcoEncoder::new(&mut result);
      encoder.write_image(&buffer, width, height, P::COLOR_TYPE).unwrap();
    }
  };
  Ok(result.into_boxed_slice())
}

fn convert_format<'a>(buffer: &[u8], format: Encoding) -> Result<Box<[u8]>, &'a str>{
  let dyn_image = load_from_memory(buffer).unwrap();
  let result: Box<[u8]>;
  match dyn_image {
    DynamicImage::ImageRgb8(buffer) => {
      println!("rgb8");
      result = encode(buffer, &format).map_err(|_| {
        "fail to encode"
      })?;
    },
    DynamicImage::ImageRgba8(buffer) => {
      println!("rgba8");
      result = encode(buffer, &format).map_err(|_| {
        "fail to encode"
      })?;
    },
    DynamicImage::ImageLuma8(buffer) => {
      println!("luma8");
      result = encode(buffer, &format).map_err(|_| {
        "fail to encode"
      })?;
    },
    DynamicImage::ImageLumaA8(buffer) => {
      println!("luma8");
      result = encode(buffer, &format).map_err(|_| {
        "fail to encode"
      })?;
    },
    _ => return Err("fail to encode")
  };
  Ok(result)
}

fn main() {
  let now = SystemTime::now();
  let img = image::open("app/src/styles/pic.jpg").unwrap();
  // let width = img.width();
  // let height = img.height();

  // let bytes = img.into_bytes();
  // let buffer = bytes.as_ref();
  let m = imageops::resize(&img, 256, 125, imageops::FilterType::Nearest);
  // let s = m.to_vec();
  // let res = convert_format(&s, Encoding::ICO).unwrap();
  let res = encode(m, &Encoding::ICO).unwrap();
  // image::save_buffer("./res.png", &res, width, height, image::ColorType::Rgb8).unwrap();
  let mut file = File::create("./res").unwrap();
  file.write_all(&res).unwrap();
  println!("{:?}", now.elapsed().unwrap().as_millis());
}