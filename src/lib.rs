mod utils;
mod filter;
mod transform;
use utils::Encoding;
use wasm_bindgen::prelude::*;

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
    encoding: Encoding
}

#[wasm_bindgen]
impl Processor{
    #[wasm_bindgen(constructor)]
    pub fn new(encoding: Encoding) -> Processor {
        Processor {
            encoding
        }
    }
    pub fn change_encoding(&mut self, encoding: Encoding) {
        self.encoding = encoding;
    }

    pub fn rotate_clock(&self, buffer: &[u8]) -> Result<Box<[u8]>, JsError> {
        transform::rotate(buffer, transform::RotateAngle::_90, &self.encoding)
    }
    
    pub fn rotate_anticlock(&self, buffer: &[u8]) -> Result<Box<[u8]>, JsError> {
        transform::rotate(buffer, transform::RotateAngle::_270, &self.encoding)
    }
}

// impl Default for Processor {
//     fn default() -> Self {
//         Processor { encoding: Encoding::PNG }
//     }
// }