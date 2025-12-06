import React from "react";
import { useParams } from "react-router";
import { getSnapshot, useEditor, Tldraw, loadSnapshot } from "tldraw";
import "tldraw/tldraw.css";
import supabase from "../utils/supabase";

const CollabComp = () => {
  const { roomId } = useParams();

  function Toolbar() {
    const editor = useEditor();

    const save = async () => {
      const snapshot = getSnapshot(editor.store);
      console.log("Saving snapshot:", snapshot);

      try {
        // First, check if the key already exists
        const { data: existing, error: checkError } = await supabase
          .from("whiteboardstable")
          .select("key")
          .eq("key", roomId);

        if (checkError) {
          console.error("Check error:", checkError);
          alert("Something went wrong while checking existing data.");
          return;
        }

        let message = "";

        if (existing && existing.length > 0) {
          // Key exists → update
          const { error: updateError } = await supabase
            .from("whiteboardstable")
            .update({ json: JSON.stringify(snapshot) })
            .eq("key", roomId);

          if (updateError) {
            console.error("Update error:", updateError);
            alert("Error updating data");
            return;
          }

          message = "Update Success";
        } else {
          // Key doesn't exist → insert
          const { error: insertError } = await supabase
            .from("whiteboardstable")
            .insert([{ key: roomId, json: JSON.stringify(snapshot) }]);

          if (insertError) {
            console.error("Insert error:", insertError);
            alert("Error saving data");
            return;
          }

          message = "Save Success";
        }

        alert(message);
      } catch (error) {
        console.error("Unexpected error:", error);
        alert("Something unexpected happened.");
      }
    };

    return (
      <div style={{ pointerEvents: "all" }}>
        <button
          onClick={save}
          className="px-4 py-2 bg-white text-black rounded-md border border-black mb-2 mt-2 mr-7"
        >
          Save Data
        </button>
      </div>
    );
  }

  const loadData = async (editor) => {
    try {
      const { data, error } = await supabase
        .from("whiteboardstable")
        .select("*")
        .eq("key", roomId);

      if (error) {
        console.error("Load error:", error);
        return;
      }

      if (data && data[0]) {
        console.log("Loaded snapshot from Supabase:", data);
        loadSnapshot(editor.store, JSON.parse(data[0]?.json));
      }
    } catch (err) {
      console.error("Unexpected load error:", err);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw
        components={{
          SharePanel: () => <Toolbar />,
        }}
        onMount={(editor) => {
          loadData(editor);
        }}
      />
    </div>
  );
};

export default CollabComp;
