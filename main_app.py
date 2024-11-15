import cv2
import mediapipe as mp

# Initialize MediaPipe's hands module
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

# Open default camera
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Unable to open camera. Exiting...")
    exit()

# Set writeable flag once
image.flags.writeable = False

while cap.isOpened():
    success, image = cap.read()
    if not success:
        print("Ignoring empty camera frame.")
        continue

    # Flip the image horizontally for a selfie-view display.
    image = cv2.flip(image, 1)

    # Process image for MediaPipe (without BGR to RGB conversion)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = hands.process(image)

    # Draw hand annotations
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
