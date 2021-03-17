#define OPEN_PIN D0
#define CLOSE_PIN D1

#define OPEN_CODE 1
#define CLOSED_CODE 0

#define BAUD_RATE 115200

bool state = false;

void setup() {
  Serial.begin(BAUD_RATE);
  initPin(OPEN_PIN);
  initPin(CLOSE_PIN);
  
  close();
  delay(1000);
  close();
}

void loop() {
  if (Serial.available()) {
    String input = Serial.readString();
    if(input.indexOf("open") >= 0){
       open();
    }else if(input.indexOf("close") >= 0){
        close();
    }else if(input.indexOf("toggle") >= 0){
        if(state)
          close();
        else
          open();
    }else if(input == "status"){
      if(state)
        Serial.print(OPEN_CODE);
      else
        Serial.print(CLOSED_CODE);
    }
  }
}

void open(){
    simulatePress(OPEN_PIN);
    state = true;
    Serial.print(OPEN_CODE);
}

void close(){
  simulatePress(CLOSE_PIN);
  state = false;
  Serial.print(CLOSED_CODE);
}

void simulatePress(int pin){
  digitalWrite(pin, LOW);
  delay(300);
  digitalWrite(pin, HIGH);
}

void initPin(int pin){
  pinMode(pin, OUTPUT);
  digitalWrite(pin, HIGH);
}
