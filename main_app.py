import cv2
import mediapipe as mp

# Initialize MediaPipe's hands module
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

# For webcam input
num_cameras = len(cv2.VideoCapture.getBackendNames())
print("Number of cameras:", num_cameras)

for i in range(num_cameras):
    cap = cv2.VideoCapture(i)
    if cap.isOpened():
        print(f"Camera {i} is opened")
        cap.release()
    else:
        print(f"Camera {i} is not available")
cap = cv2.VideoCapture(0)

with mp_hands.Hands(min_detection_confidence=0.5, min_tracking_confidence=0.5) as hands:
    while cap.isOpened():
        success, image = cap.read()
        if not success:
            print("Ignoring empty camera frame.")
            # If loading a video, you might want to break the loop here.
            continue

        # Flip the image horizontally for a selfie-view display.
        image = cv2.flip(image, 1)

        # To improve performance, optionally mark the image as not writeable to
        # pass by reference.
        image.flags.writeable = False
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = hands.process(image)

        # Draw the hand annotations on the image.
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                mp_drawing.draw_landmarks(
                    image,
                    hand_landmarks,
                    mp_hands.HAND_CONNECTIONS,
                    mp_drawing.DrawingSpec(color=(0, 0, 255), thickness=2, circle_radius=4),
                    mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
                )

        cv2.imshow('MediaPipe Hands', image)
        if cv2.waitKey(5) & 0xFF == 27:
            break

cap.release()
cv2.destroyAllWindows()
