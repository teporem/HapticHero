import usb_cdc
# disable console so only one serial port is available with expected IDs
usb_cdc.enable(console=False, data=True)
