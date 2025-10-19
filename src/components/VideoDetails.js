import React, { useEffect, useState } from "react";
import axios from "axios";

const VideoDetails = ({ videoId }) => {
    const [video, setVideo] = useState(null);

    useEffect(() => {
        const fetchVideo = async () => {
            const res = await axios.get(`http://localhost:5000/api/videos/${videoId}`);
            setVideo(res.data);
        };
        fetchVideo();
    }, [videoId]);

    if (!video) return <p>Loading...</p>;

    return (
        <div>
            <h2>{video.snippet.title}</h2>
            <p>{video.snippet.description}</p>
            <p>Views: {video.statistics.viewCount}</p>
        </div>
    );
};

export default VideoDetails;
