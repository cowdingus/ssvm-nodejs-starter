use wasm_bindgen::prelude::*;
use std::fs;
use ssvm_wasi_helper::ssvm_wasi_helper::_initialize;
use std::path::{Path, PathBuf};
use serde::{Serialize, Deserialize};

// -------------- CalculataTrianglata --------------
#[wasm_bindgen]
pub fn calculate_triangle_area(params: &str) -> String
{
  let params: (f32, f32) = serde_json::from_str(&params).unwrap();
  serde_json::to_string(&((params.0 * params.1) / 2.0)).unwrap()
}

// -------------- NoteUrDay --------------
#[derive(Serialize, Deserialize, Debug)]
struct Note
{
  title: String,
  content: String
}

fn get_note_filepath(title: &str) -> PathBuf 
{
  return Path::new("/").join("notes").join(format!("{}.note", title)).to_path_buf();
}

#[wasm_bindgen]
pub fn get_notes() -> String
{
  _initialize();
  let mut notes: Vec<Note> = Vec::new();

  let entries = fs::read_dir("/notes").expect("Can't list notes");
  for entry in entries
  {
    let entry = entry.unwrap();
    let note_title = String::from(Path::new(&entry.file_name()).file_stem().unwrap().to_str().unwrap());
    let note = Note {
      title: String::from(&note_title),
      content: read_note(&note_title)
    };
    notes.push(note);
  }

  serde_json::to_string(&notes).unwrap()
}

#[wasm_bindgen]
pub fn write_note(title: &str, content: &str) 
{
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
pub fn delete_note(title: &str) -> String
{
  _initialize();
  let note = get_note_filepath(title);
  match fs::remove_file(note) {
    Ok(_) => { println!("A note {} has been deleted.", title); return String::from("Success") },
    Err(_) => { println!("Failed to delete note {}.", title); return String::from("Error") },
  }
}
