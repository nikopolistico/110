// supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ovqxenrzncjffzdcwabk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92cXhlbnJ6bmNqZmZ6ZGN3YWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIwMDYxMzksImV4cCI6MjA0NzU4MjEzOX0.U5rmB58bb_Nk_PlXHvnSl55KkEiM6qsh4wNzA5yhamY'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Success Notification
function successNotification(message, seconds = 0) {
    document.querySelector(".alert-success").classList.remove("d-none");
    document.querySelector(".alert-success").classList.add("d-block");
    document.querySelector(".alert-success").innerHTML = message;

    if (seconds != 0) {
        setTimeout(function () {
            document
                .querySelector(".alert-success")
                .classList.remove("d-block");
            document.querySelector(".alert-success").classList.add("d-none");
        }, seconds * 1000);
    }
}

// Error Notification
function errorNotification(message, seconds = 0) {
    document.querySelector(".alert-danger").classList.remove("d-none");
    document.querySelector(".alert-danger").classList.add("d-block");
    document.querySelector(".alert-danger").innerHTML = message;

    if (seconds != 0) {
        setTimeout(function () {
            document.querySelector(".alert-danger").classList.remove("d-block");
            document.querySelector(".alert-danger").classList.add("d-none");
        }, seconds * 1000);
    }
}

export { supabase, successNotification, errorNotification };
