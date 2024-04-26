import analogio
import sys
from board import VOLTAGE_MONITOR
import board
import digitalio
import time

led = digitalio.DigitalInOut(board.LED)
led.direction = digitalio.Direction.OUTPUT
led.value = True

while True:
    print("sys.implementation:{}".format(sys.implementation))
    print("sys.version:{}".format(sys.version))
    pin = analogio.AnalogIn(VOLTAGE_MONITOR)
    adc_reading  = pin.value
    adc_voltage  = (adc_reading * pin.reference_voltage) / 65535
    vsys_voltage = adc_voltage * 3
    #if vsys_voltage < 3:
        #led.value = False
    print("""ADC reading:{}
    ADC voltage:{}
    VSYS voltage:{}""".format(adc_reading, adc_voltage, vsys_voltage))
    pin.deinit()
    time.sleep(1)
