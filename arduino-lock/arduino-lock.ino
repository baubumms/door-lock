#define OPEN_PIN D0
#define CLOSE_PIN D2
#define TOGGLE_BUTTON_PIN D7

#define OPEN_CODE 1
#define CLOSED_CODE 0

#define BAUD_RATE 115200

bool state = false;

void setup() {
  Serial.begin(BAUD_RATE);

  //Button emulation
  initPin(OPEN_PIN);
  groundPin(D1);
  initPin(CLOSE_PIN);
  groundPin(D3);

  //Toggle Button
  pinMode(TOGGLE_BUTTON_PIN, INPUT_PULLUP);
  
  close();
  delay(1000);
  close();
}

void loop() {

  //Serial Communication
  if (Serial.available()) {
    String input = Serial.readString();
    if(input.indexOf("open") >= 0){
       open();
    }else if(input.indexOf("close") >= 0){
        close();
    }else if(input.indexOf("toggle") >= 0){
        toggle();
    }else if(input == "status"){
      if(state)
        Serial.print(OPEN_CODE);
      else
        Serial.print(CLOSED_CODE);
    }
  }

  //Toggle Button
  if(digitalRead(TOGGLE_BUTTON_PIN) == LOW){
    delay(3);
    if( !(digitalRead(TOGGLE_BUTTON_PIN) == LOW) )
      return;

    toggle();
    delay(2000);
  }
}

void toggle(){
  if(state)
    close();
  else
    open();
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
  digitalWrite(pin, HIGH);
  delay(300);
  digitalWrite(pin, LOW);
}

void initPin(int pin){
  pinMode(pin, OUTPUT);
  digitalWrite(pin, LOW);
}

void groundPin(int pin){
  pinMode(pin, OUTPUT);
  digitalWrite(pin, LOW);
}
