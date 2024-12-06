import cv2
import mediapipe as mp

def run_hand_detection():
    mp_hands = mp.solutions.hands
    mp_drawing = mp.solutions.drawing_utils

    # Initialize the Hands module
    hands = mp_hands.Hands(
        static_image_mode=False,
        max_num_hands=2,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )

    def detect_gesture(hand_landmarks):
        # Get coordinates of finger tips and lower joints
        thumb_tip = hand_landmarks.landmark[mp_hands.HandLandmark.THUMB_TIP]
        thumb_ip = hand_landmarks.landmark[mp_hands.HandLandmark.THUMB_IP]
        wrist = hand_landmarks.landmark[mp_hands.HandLandmark.WRIST]

        index_tip = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP]
        index_mcp = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_MCP]

        middle_tip = hand_landmarks.landmark[mp_hands.HandLandmark.MIDDLE_FINGER_TIP]
        middle_mcp = hand_landmarks.landmark[mp_hands.HandLandmark.MIDDLE_FINGER_MCP]

        ring_tip = hand_landmarks.landmark[mp_hands.HandLandmark.RING_FINGER_TIP]
        ring_mcp = hand_landmarks.landmark[mp_hands.HandLandmark.RING_FINGER_MCP]

        pinky_tip = hand_landmarks.landmark[mp_hands.HandLandmark.PINKY_TIP]
        pinky_mcp = hand_landmarks.landmark[mp_hands.HandLandmark.PINKY_MCP]

        # Check if fingers are extended
        thumb_extended = thumb_tip.y < thumb_ip.y
        index_extended = index_tip.y < index_mcp.y
        middle_extended = middle_tip.y < middle_mcp.y
        ring_extended = ring_tip.y < ring_mcp.y
        pinky_extended = pinky_tip.y < pinky_mcp.y

        # Determine if the hand is open or closed
        is_hand_open = all([thumb_extended, index_extended, middle_extended, ring_extended, pinky_extended])
        is_hand_closed = not any([index_extended, middle_extended, ring_extended, pinky_extended])

        # Determine if the hand is facing the camera
        z_coords = [landmark.z for landmark in hand_landmarks.landmark]
        is_facing_camera = max(z_coords) - min(z_coords) < 0.1  # Low Z variance means the hand is perpendicular

        # Gesture logic
        if is_hand_open and is_facing_camera:
            return "Hand Open and Facing Camera"
        elif is_hand_closed and is_facing_camera:
            return "Hand Closed and Facing Camera"
        elif thumb_extended and thumb_tip.y < wrist.y and not is_hand_open:
            return "Thumbs Up"
        elif thumb_tip.y > wrist.y and not is_hand_open:
            return "Thumbs Down"

        return "Neutral"

    # Start video capture
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
        cv2.imshow("Hand Gesture Detection", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

# Calling the function
# run_hand_detection()
