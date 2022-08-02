
import React, { useState } from "react";
import { Avatar, Button } from '@mui/material'

import firebase from 'firebase/compat/app';
import './css/imageupload.css'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';


import db, { storage } from "./firebase";



export default function ImageUpload({ username }) {
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState("");
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState("");
    const [caption, setCaption] = useState("");

    const handleChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const fileType = file["type"];
            const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
            if (validImageTypes.includes(fileType)) {
                setError("");
                setImage(file);
            } else {
                console.log("error");
                setError("error please upload a image file");
            }
        }
    };

    const handleUpload = () => {
        if (image) {
            // add to image folder in firebase
            const uploadTask = storage.ref(`images/${image.name}`).put(image);
            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setProgress(progress);
                },
                (error) => {
                    // error function ....
                    console.log(error);
                    setError(error);
                },
                () => {
                    // complete function ....
                    storage
                        .ref("images")
                        .child(image.name) // Upload the file and metadata
                        .getDownloadURL() // get download url
                        .then((url) => {
                            setUrl(url);
                            db.collection("posts").add({
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                caption: caption,
                                imageUrl: url,
                                username: username,
                            });
                            setProgress(0);
                            setCaption("");
                            setImage(null);
                        });
                }
            );
        } else {
            setError("Error please choose an image to upload");
        }
    };



    const fileInputRef = React.createRef();


    return (
        <div className="upload">
            <div className="upload_first">
                <Avatar
                    className="post__avatar"
                    alt="Merit"
                    src="./images/avatar1.jpg"
                />
                <input
                    type="text"
                    placeholder="What's on your mind?"
                    value={caption}
                    onChange={(event) => setCaption(event.target.value)}
                    className="upload_caption"
                />
            </div>


            <div className="upload_content">
                <Button
                    onClick={() => fileInputRef.current.click()}
                    startIcon={<AddAPhotoIcon />}

                    color="primary"
                    variant="contained"
                >
                    Upload Photo
                </Button>
                <input type="file" onChange={handleChange} hidden ref={fileInputRef} />


                <Button variant="contained" onClick={handleUpload} color="secondary"
                >
                    Create Post
                </Button>
            </div>

            <br />

            <p style={{ color: "red" }}>{error}</p>
            {progress > 0 ? <center><progress value={progress} max="100" /></center> : ""}
        </div>
    );
}