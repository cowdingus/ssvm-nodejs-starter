use wasm_bindgen::prelude::*;
use std::fs;
use ssvm_wasi_helper::ssvm_wasi_helper::_initialize;
use std::path::{Path, PathBuf};

fn get_note_filepath(title: &str) -> PathBuf
{
  let note = format!("/notes/{}.note", title);
  return Path::new(&note).to_path_buf();
}


#[wasm_bindgen]
pub fn write_note(title: &str, content: &str) {
  _initialize();
  let note = get_note_filepath(title);
  match fs::write(note, content.as_bytes()) {
    Ok(_) => { println!("Note {} written.", title); },
    Err(_) => { println!("Unable to create or rewrite {} note.", title) },
  }
}

#[wasm_bindgen]
pub fn read_note(title: &str) -> String
{
  _initialize();
  let note = get_note_filepath(title);
  match fs::read_to_string(note) {
    Ok(content) => return content,
    Err(_) => { println!("Unable to read note {}", title); return String::new() },
  }
}

#[wasm_bindgen]
pub fn delete_note(title: &str)
{
  _initialize();
  let note = get_note_filepath(title);
  match fs::remove_file(note) {
    Ok(_) => { println!("A note {} has been deleted.", title); },
    Err(_) => { println!("Failed to delete note {}.", title); },
  }
}
