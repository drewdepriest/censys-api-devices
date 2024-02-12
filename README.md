# censys-api-devices
Daily call to Censys.io API to retrieve data on publicly-exposed operational technology (OT) devices, generally assumed to be part of commercial building automation system (BAS) or building management systems (BMS). Sharing this publicly to help call attention to the important of securing your OT devices that impact facility operations like HVAC.

For two years, I ran this script on a daily trigger to call the [Censys](https://search.censys.io/) API in search of all publicly-exposed BACnet, MQTT, Modbus, and "Occupancy" devices. At the beginning of 2024, Censys started limiting their free tier of API to 60-days, so I decided to bring this experiment to a close. It ran faithfully from Feb 05th, 2022 to Feb 05th, 2024. 

I've long been fascinated by the collision of OT (i.e. BAS, BMS, LMS, etc) with cybersecurity. A cybersecurity consultant my company hired first opened my eyes to Censys and [Shodan](https://www.shodan.io/) back in 2015, the implication being that far too many OT devices get installed and left exposed to the public internet.

My research here only captured raw counts of discovered devices and associated device manufacturers (vendors) - I did not ingest any site-identifying information (i.e. IPs, ISP, location, etc).

The Apps Script project calls the Censys API and writes all results to a Google Sheet, which then gets consumed for a [viz layer in Tableau Public](https://public.tableau.com/views/CensysScannedOTDevices/FullView?:language=en-US&:display_count=n&:origin=viz_share_link)).

Over the course of two years, the number of BACnet devices connected to public Interwebz **fell by 7.8%.**

Modbus devices **increased by 2.3%**, and MQTT **rose by 13.3%.**
