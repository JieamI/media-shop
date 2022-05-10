use image::imageops;
use std::time::{ SystemTime };

fn main() {
  let now = SystemTime::now();
  let img = image::open("app/src/styles/pic.jpg").unwrap();
  // let rgb = img.to_rgb8();
  // for (x, y, p) in rgb.enumerate_pixels_mut() {
  //     if x == y {
  //         p.0 = [0,0,0];
  //     }
  // }
  // rgb = imageops::flip_horizontal(&rgb);
  // let res = imageops::brighten(&rgb, 200); // recomended value -200 ~ 200
  // rgb = imageops::contrast(&rgb, 100.0); // recomended value -100.0 ~ 100.0
  // let res: ImageBuffer<Luma<u8>, Vec<u8>> = imageops::grayscale(&rgb);
  // let res = imageops::blur(&rgb, 100.0);
  let width = img.width();
  let height = img.height();
  println!("{}, {}", width * 4, height * 4);
  let res = imageops::resize(&img, 4 * width, 4 * height, imageops::FilterType::Nearest);
  // let mut gray = img.into_luma8();
  // for (_, _, p) in gray.enumerate_pixels_mut() {
  //   if p.0[0] <= 150 {
  //     p.0 = [0]
  //   }else {
  //     p.0 = [255]
  //   }
  // };
  // let res = imageops::huerotate(&rgb, 180);
  // imageops::invert(&mut rgb);
  // image::save_buffer("./res.png", &rgb, rgb.width(), rgb.height(), image::ColorType::Rgb8).unwrap();
  println!("{:?}", now.elapsed().unwrap().as_millis());
  image::save_buffer("./res.png", &res, res.width(), res.height(), image::ColorType::Rgba8).unwrap();
}