
fn main() {
  let img = image::open("./fractal.png").unwrap();
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
  // let res = imageops::resize(&rgb, 800, 1600, imageops::FilterType::Nearest);
  let mut gray = img.into_luma8();
  for (_, _, p) in gray.enumerate_pixels_mut() {
    if p.0[0] <= 150 {
      p.0 = [0]
    }else {
      p.0 = [255]
    }
  };
  // let res = imageops::huerotate(&rgb, 180);
  // imageops::invert(&mut rgb);
  // image::save_buffer("./res.png", &rgb, rgb.width(), rgb.height(), image::ColorType::Rgb8).unwrap();
  image::save_buffer("./res.png", &gray, gray.width(), gray.height(), image::ColorType::L8).unwrap();
  println!("dwadwadwadw")
}