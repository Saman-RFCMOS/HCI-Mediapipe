#Saman, Mahir, Fariz, Anıl
## This our assignmnet 5 code in py: "Hand Gesture Detection using Google Mediapipe"
import cv2
import mediapipe as mp

# Mediapipe Hand Detection modules intitialization.
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
hands = mp_hands.Hands(static_image_mode=False,max_num_hands=2, min_detection_confidence=0.5,min_tracking_confidence=0.5)

# webcam opening.
cap = cv2.VideoCapture(0)
print("Press 'q' to quit")


while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        print("Failed to grab frame. Exiting...")
        break
      
    frame = cv2.flip(frame, 1)# Flip the frame horizontally for a mirrored effect

    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB) # Convert the frame color from BGR to RGB
    
    results = hands.process(rgb_frame) # Process the frame to detect hand landmarks

    #draw hand landmarks on the frame with following.
    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            mp_drawing.draw_landmarks(
                frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

            index_finger_tip = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP]
            print(f"Index Finger Tip: x={index_finger_tip.x}, y={index_finger_tip.y}, z={index_finger_tip.z}") #landmark coordinates of the index finger tip.

    cv2.imshow("Hand Gesture Detection", frame)    #displaying frame with hand landmarks.

    #exit: press 'q'.
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
hands.close()
