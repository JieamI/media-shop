// use image::EncodableLayout;
// use image::ImageEncoder;
// use image::RgbImage;
// use image::buffer::ConvertBuffer;
// use image::load_from_memory;
// use image::imageops;
// use std::fs::File;
// use std::io::Read;
// use std::io::Write;
// use image::codecs::png::PngEncoder;

fn main() {
    let img = image::open("./fractal.png").unwrap();
    let mut rgb = img.to_rgb8();
    for (x, y, p) in rgb.enumerate_pixels_mut() {
        if x == y {
            p.0 = [0,0,0];
        }
    }
    image::save_buffer("./res.png", &rgb, rgb.width(), rgb.height(), image::ColorType::Rgb8).unwrap();
   
    // let mut img = File::open("./fractal.png").unwrap();
    // let buffer = &mut Vec::<u8>::new();
    // img.read_to_end(buffer).unwrap();
    // let dyn_image = load_from_memory(buffer.as_bytes()).unwrap();
    // let result = imageops::rotate90(&dyn_image);
    // let result: RgbImage = result.convert();
    // let result = result.into_raw().into_boxed_slice();
    // image::save_buffer("./res.png", &result, 800, 800, image::ColorType::Rgb8).unwrap();
    // let mut result_buffer = Vec::<u8>::new();
    // let encoder = PngEncoder::new(&mut result_buffer);
    // encoder.write_image(&result, 800, 800, image::ColorType::Rgb8).unwrap();
    // let mut file = File::create("./res.png").unwrap();
    // file.write_all(&result_buffer).expect("write fail");
}