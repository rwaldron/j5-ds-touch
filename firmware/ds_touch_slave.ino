#include <Wire.h>

#define I2C_ADDRESS 4
#define REGISTER_SIZE 4

// TODO: These should be settable via i2c write
int y1 = A0;
int x2 = A1;
int y2 = A2;
int x1 = A3;

byte buffer[REGISTER_SIZE];
/*
  [0] x msb
  [1] x lsb
  [2] y msb
  [3] y lsb
*/

void setup() {
  Wire.begin(I2C_ADDRESS);
  Wire.onRequest(onRequest);
}

int readX() {
  pinMode(y1, INPUT);
  pinMode(x2, OUTPUT);
  pinMode(y2, INPUT);
  pinMode(x1, OUTPUT);

  digitalWrite(x2, LOW);
  digitalWrite(x1, HIGH);

  // Allow analog pins to adjust
  delay(5);

  return analogRead(y1);
}

int readY() {
  pinMode(y1, OUTPUT);
  pinMode(x2, INPUT);
  pinMode(y2, OUTPUT);
  pinMode(x1, INPUT);

  digitalWrite(y1, LOW);
  digitalWrite(y2, HIGH);

  // Allow analog pins to adjust
  delay(5);

  return analogRead(x2);
}

void loop() {
  int x = readX();
  int y = readY();

  buffer[0] = x >> 8;
  buffer[1] = x & 0xFF;
  buffer[2] = y >> 8;
  buffer[3] = y & 0xFF;
}

void onRequest() {
  Wire.write(buffer, 4);
}
