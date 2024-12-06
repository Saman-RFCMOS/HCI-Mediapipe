import cv2
import mediapipe as mp

def run_thumbs_detection():
    mp_hands = mp.solutions.hands
    mp_drawing = mp.solutions.drawing_utils

    # Initialize the Hands module
    hands = mp_hands.Hands(
        static_image_mode=False,
        max_num_hands=2,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )

    # Gesture detection function
    def detect_gesture(hand_landmarks):
        # Get thumb tip and wrist coordinates
        thumb_tip = hand_landmarks.landmark[mp_hands.HandLandmark.THUMB_TIP]
        thumb_ip = hand_landmarks.landmark[mp_hands.HandLandmark.THUMB_IP]
        wrist = hand_landmarks.landmark[mp_hands.HandLandmark.WRIST]

        # Get the positions of other fingers (index, middle, ring, and pinky)
        index_tip = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP]
        middle_tip = hand_landmarks.landmark[mp_hands.HandLandmark.MIDDLE_FINGER_TIP]
        ring_tip = hand_landmarks.landmark[mp_hands.HandLandmark.RING_FINGER_TIP]
        pinky_tip = hand_landmarks.landmark[mp_hands.HandLandmark.PINKY_TIP]

        # Check if the thumb is extended (thumb tip is above the wrist)
        thumb_is_extended = thumb_tip.y < wrist.y

        # Check if other fingers are curled (for fist detection)
        fingers_curl_check = (index_tip.y > hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_MCP].y and
                              middle_tip.y > hand_landmarks.landmark[mp_hands.HandLandmark.MIDDLE_FINGER_MCP].y and
                              ring_tip.y > hand_landmarks.landmark[mp_hands.HandLandmark.RING_FINGER_MCP].y and
                              pinky_tip.y > hand_landmarks.landmark[mp_hands.HandLandmark.PINKY_MCP].y)

        # Logic for thumbs-up and thumbs-down gestures
        if thumb_is_extended:
            if not fingers_curl_check:  # Thumb up with extended fingers
                return "Thumbs Up"
        elif thumb_tip.y > wrist.y:
            return "Thumbs Down"
        
        return "Neutral"  # For other gestures (like fist)

    # Start the video capture
    cap = cv2.VideoCapture(0)

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Flip the image horizontally for a mirror view
        frame = cv2.flip(frame, 1)
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Process the frame with MediaPipe Hands
        results = hands.process(rgb_frame)

        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                # Draw hand landmarks on the frame
                mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

                # Detect gesture
                gesture = detect_gesture(hand_landmarks)
                cv2.putText(frame, gesture, (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        # Display the frame
        cv2.imshow("Thumbs Up or Down", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

# Call the function to run the program
run_thumbs_detection()
