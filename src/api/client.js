import axios from "axios";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWI3Y2I2ZTIxOWU4Yzc2YmRhYTczOWUiLCJpYXQiOjE3NzYwNjg4NzQsImV4cCI6MTc3NjY3MzY3NH0.g24xwWeNdA9GEGbG33pJW4DSTvIb_D0LN_0FtrL4WOQ";

const client = axios.create({
    baseURL: "/api",
    headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
    },
});

export default client;
