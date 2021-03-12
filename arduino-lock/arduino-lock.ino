#define OPEN_PIN D0
#define CLOSE_PIN D1

bool state = false;

void setup() {
  Serial.begin(9600);
  initPin(OPEN_PIN);
  initPin(CLOSE_PIN);

}

void loop() {
  if (Serial.available()) {
    String input = Serial.readString();
    if(input == "open"){
        simulatePress(OPEN_PIN);
        state = true;
        Serial.println(0x00);
    }else if(input == "close"){
        simulatePress(CLOSE_PIN);
        state = false;
        Serial.println(0x11);
    }else if(input == "toggle"){
        if(state)
          simulatePress(CLOSE_PIN);
        else
          simulatePress(OPEN_PIN);
        state = !state;
        Serial.println(0x22);
    }else if(input == "status"){
      Serial.println(state);
    }
  }
}

void simulatePress(int pin){
  digitalWrite(pin,LOW);
  delay(300);
  digitalWrite(pin, HIGH);
}

void initPin(int pin){
  pinMode(pin, OUTPUT);
  digitalWrite(pin, HIGH);
}