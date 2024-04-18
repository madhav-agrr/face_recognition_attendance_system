import face_recognition
import cv2
import numpy as np
import csv
import os
from datetime import datetime
import mysql.connector
from flask import Flask

# Establish connection to MySQL database
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="facetrack_db"
)
mycursor = mydb.cursor()

app = Flask(__name__)

# Store face encodings and names in lists
known_face_encoding = []
known_faces_names = []

# Flag to track if CSV file has been created
csv_created = False
csv_file_name = ""

def load_face_data():
    global known_face_encoding, known_faces_names
    
    # Load face images and encodings
    madhav_image = face_recognition.load_image_file("C:/Users/admin/attendance-management/face/images/madhav.jpg")
    madhav_encoding = face_recognition.face_encodings(madhav_image)[0]

    # aman_image = face_recognition.load_image_file("C:/Users/admin/attendance-management/face/images/aman.jpeg")
    # aman_encoding = face_recognition.face_encodings(aman_image)[0]

    prab_image = face_recognition.load_image_file("C:/Users/admin/attendance-management/face/images/prab.jpeg")
    prab_encoding = face_recognition.face_encodings(prab_image)[0]

    # akshat_image = face_recognition.load_image_file("C:/Users/admin/attendance-management/face/images/akshat.jpeg")
    # akshat_encoding = face_recognition.face_encodings(akshat_image)[0]

    # chirag_image = face_recognition.load_image_file("C:/Users/admin/attendance-management/face/images/chirag.jpeg")
    # chirag_encoding = face_recognition.face_encodings(chirag_image)[0]

    # vansh_image = face_recognition.load_image_file("C:/Users/admin/attendance-management/face/images/vansh.jpeg")
    # vansh_encoding = face_recognition.face_encodings(vansh_image)[0]

    # rahul_image = face_recognition.load_image_file("C:/Users/admin/attendance-management/face/images/rahul.jpeg")
    # rahul_encoding = face_recognition.face_encodings(rahul_image)[0]

    # avichal_image = face_recognition.load_image_file("C:/Users/admin/attendance-management/face/images/avichal.jpeg")
    # avichal_encoding = face_recognition.face_encodings(avichal_image)[0]

    hod_image = face_recognition.load_image_file("C:/Users/admin/attendance-management/face/images/hod.jpeg")
    hod_encoding = face_recognition.face_encodings(hod_image)[0]

    # Store face encodings and names in lists
    known_face_encoding.extend([
        madhav_encoding,
        # aman_encoding,
        prab_encoding,
        # akshat_encoding,
        # chirag_encoding,
        # vansh_encoding,
        # rahul_encoding,
        # avichal_encoding,
        hod_encoding
    ])

    known_faces_names.extend([
        "Madhav Agarwal",
        # "Aman Kumar",
        "Prabhakar",
        # "Akshat Khandelwal",
        # "Chirag Mathur",
        # "Vansh Gupta",
        # "Rahul Jaiswal",
        # "Avichal Kachori",
        "Dr. Sunil Gupta"
    ])

load_face_data()

students = known_faces_names.copy()

@app.route('/upload-attendance', methods=['POST'])
def upload_attendance():
    global csv_created, csv_file_name
    try:
        attendance_data = []
        video_capture = cv2.VideoCapture(0)  # Move camera initialization inside the route function

        while True:
            _, frame = video_capture.read()
            cv2.imshow("attendance system", frame)  # Show camera feed

            small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
            rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)
            face_locations = face_recognition.face_locations(rgb_small_frame)

            if face_locations:
                face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)
                for face_encoding in face_encodings:
                    matches = face_recognition.compare_faces(known_face_encoding, face_encoding)
                    name = ""
                    face_distance = face_recognition.face_distance(known_face_encoding, face_encoding)
                    best_match_index = np.argmin(face_distance)
                    if matches[best_match_index]:
                        name = known_faces_names[best_match_index]

                    if name in known_faces_names:
                        font = cv2.FONT_HERSHEY_SIMPLEX
                        bottomLeftCornerOfText = (10, 100)  # Adjusted position
                        fontScale = 1.5
                        fontColor = (255, 0, 0)
                        thickness = 3
                        lineType = 2

                        cv2.putText(frame, name + ' Present',
                                    bottomLeftCornerOfText,
                                    font,
                                    fontScale,
                                    fontColor,
                                    thickness,
                                    lineType)
                            
                        if name in students:
                            students.remove(name)
                            current_date = datetime.now().strftime("%Y-%m-%d")
                            current_time = datetime.now().strftime("%H-%M-%S")
                            row_data = [name, current_date, current_time]
                            print("Writing to CSV:", row_data)

                            # Check if CSV file has been created
                            if not csv_created:
                                # Generate CSV file name with current date and time
                                csv_file_name = f"attendance_{current_date}_{current_time}.csv"
                                csv_created = True

                            with open(csv_file_name, 'a', newline='') as csvfile:
                                writer = csv.writer(csvfile)
                                writer.writerow(row_data)

                            sql = "INSERT INTO attendance (R_id, Name, date, time) VALUES (%s, %s, %s, %s)"
                            val = (known_faces_names.index(name) + 1, name, current_date, current_time)
                            mycursor.execute(sql, val)
                            mydb.commit()

                            attendance_data.append(row_data)


            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        video_capture.release()
        cv2.destroyAllWindows()

        update_query = "UPDATE attendance JOIN users_login ON attendance.Name = users_login.Name SET attendance.R_id = users_login.R_id"
        mycursor.execute(update_query)
        mydb.commit()

        return 'Attendance uploaded successfully', 200
    except Exception as e:
        return str(e), 500

if __name__ == '__main__':
    app.run(debug=True)
