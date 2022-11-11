import React, { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { convertFromRaw, Editor, EditorState, RichUtils } from "draft-js";
import clx from "classnames";
import "./App.css";
import "draft-js/dist/Draft.css";
import {
  extractCode,
  generateEditorStateFromRawContent,
  IFile,
  initFile,
  insertCodeBlock,
  styleMap,
} from "./utils";

function App() {
  const [files, setFiles] = useState<IFile[]>([]);
  const [currentFile, setCurrentFile] = useState<IFile>({} as IFile);
  const [title, setTitle] = useState("Deborah");
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const editorRef = useRef<Editor>(null);
  const [codeRes, setCodeRes] = useState("");

  useEffect(() => {
    // Fetch or generate a file
    const file = initFile();
    setFiles([file]);
    setCurrentFile(file);
    setEditorState(generateEditorStateFromRawContent(file.content));
  }, []);

  const editContent = useCallback((e: any) => {
    e.target.contentEditable = true;
  }, []);

  const isFileActive = useCallback(
    (id: string | undefined) => currentFile?.id === id,
    [currentFile]
  );

  const selectFile = useCallback(
    (id: string | undefined) => (e: any) => {
      const file = files.find((file) => file.id === id);
      setCurrentFile(file as IFile);
    },
    [files]
  );

  const updateCurrentFile = useCallback(
    (prop: string) => (e: any) => {
      setCurrentFile({ ...currentFile, [prop]: e.target.value });
    },
    [files, currentFile]
  );

  const handleKeyCommand = (command: any, editorState: any) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return "handled";
    }

    return "not-handled";
  };

  const toggleStyle = (style: string) => (e: any) => {
    e.preventDefault();
    setEditorState(
      RichUtils.toggleInlineStyle(insertCodeBlock(editorState), "CODE")
    );
  };

  const activateIcon = () => {
    return editorState.getCurrentInlineStyle().has("CODE");
  };

  const run = async () => {
    const code = extractCode(editorState);
    const res = await fetch("http://localhost:4000/run", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    }).then((res) => res.text());
    setCodeRes(res);
  };

  const updateTitle = useCallback((e: any) => {}, []);
  return (
    <>
      <div className="App">
        <div className="note-lists">
          <div className="note-lists-icons">
            <button className="icon">
              <i className="fas fa-plus"></i>
            </button>
            <button className="icon">
              <i className="fas fa-times"></i>
            </button>
            <br />
            <br />
            <i className="fas fa-folder"></i> /
            <span
              className="note-name"
              onDoubleClick={(e) => editContent(e)}
              onBlur={updateTitle}
            >
              {` ${title}`}
            </span>
          </div>
          <div className="note-lists-files">
            {files.map((file) => (
              <div
                className={clx({
                  "note-lists-file": true,
                  "note-lists-file-active": isFileActive(file.id),
                })}
                onClick={selectFile(file.id)}
                key={file.id}
              >
                {file.name}
              </div>
            ))}
          </div>
        </div>
        <div className="note-page">
          <div className="note-page-icons">
            <button className="icon" title="Run" onMouseDown={run}>
              <i className="fas fa-play"></i>
            </button>
            <button
              onMouseDown={toggleStyle("CODE")}
              className={clx({
                icon: true,
                "icon-active": activateIcon(),
              })}
            >
              <i className="fas fa-code"></i>
            </button>
          </div>
          {/*{currentFile.name && (*/}
          <div className="note-page-content">
            <div className="note-page-content-icons"></div>
            <Editor
              customStyleMap={styleMap}
              ref={editorRef}
              editorState={editorState}
              onChange={setEditorState}
              handleKeyCommand={handleKeyCommand}
            />
            {codeRes && (
              <div className="note-page-response">Output: {codeRes}</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
