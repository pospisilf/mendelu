# 2025-04-21 02:51:32 by RouterOS 7.18.2
# system id = wCYKctVuyYC
#
/interface ethernet
set [ find default-name=ether1 ] disable-running-check=no name=LAN
set [ find default-name=ether2 ] disable-running-check=no name=WAN
set [ find default-name=ether3 ] disable-running-check=no name=DMZ
set [ find default-name=ether4 ] disable-running-check=no name=MGMT

/ip address
add address=192.168.244.1/24 comment=LAN interface=LAN network=192.168.244.0
add address=111.26.90.1/24 comment=WAN interface=WAN network=111.26.90.0
add address=172.26.154.1/24 comment=DMZ interface=DMZ network=172.26.154.0
add address=192.168.56.10/24 comment=MGMT interface=MGMT network=192.168.56.0

/ip dhcp-client
add interface=WAN

/ip firewall address-list
add address=93.197.191.193 list=lan2wan-blockedDstAddr
add address=87.207.18.53 list=lan2wan-blockedDstAddr
add address=31.123.141.17 list=lan2wan-blockedDstAddr

add address=192.168.244.46 list=lan2wan-httpsOnly
add address=192.168.244.150 list=lan2wan-httpsOnly

add address=192.168.244.132 list=wan2lan-rdpAllowed
add address=192.168.244.114 list=wan2lan-rdpAllowed

add address=54.31.73.188 list=wan2lan-allowAll
add address=121.241.229.2 list=wan2lan-allowAll
add address=126.200.175.244 list=wan2lan-allowAll
add address=213.154.50.137 list=wan2lan-allowAll
add address=74.121.58.68 list=wan2lan-allowAll

add address=139.95.186.0/24 list=lan2dmz-allowVNC
add address=118.220.155.77 list=lan2dmz-allowVNC
add address=186.223.69.39 list=lan2dmz-allowVNC

add address=44.143.11.0/24 list=lan2dmz-allowAll
add address=82.178.33.0/24 list=lan2dmz-allowAll
add address=129.64.0.0/16 list=lan2dmz-allowAll

add address=139.95.186.0/24 list=wan2dmz-allowVNC
add address=118.220.155.77 list=wan2dmz-allowVNC
add address=186.223.69.39 list=wan2dmz-allowVNC

add address=44.143.11.0/24 list=wan2dmz-allowAll
add address=82.178.33.0/24 list=wan2dmz-allowAll
add address=129.64.0.0/16 list=wan2dmz-allowAll

add address=192.168.244.26 list=lan2dmz-rdpLANsrc
add address=192.168.244.114 list=lan2dmz-rdpLANsrc

add address=192.168.244.41-192.168.244.57 list=wan2lan-telnet

/ip firewall filter
# stavovy firewall - forward chain
add action=accept chain=forward connection-state=established,related
add action=drop chain=forward connection-state=invalid

#LAN -> WAN
# Skok na vlastni chain.
add action=jump chain=forward in-interface=LAN jump-target=LAN2WAN out-interface=WAN
# Zakazat komunikaci na transportni protokol(y) a port(y) odpovidajici protokolu SMTP a SMTPS.
add action=drop chain=LAN2WAN dst-port=25,465,587,2525 protocol=tcp
# Zakazat komunikaci z adres vnitrni site (LAN), ktere maji na konci .46 a .150 na cokoliv krome HTTP, HTTPS
add action=accept chain=LAN2WAN dst-port=80,443 protocol=tcp src-address-list=lan2wan-httpsOnly
add action=drop chain=LAN2WAN src-address-list=lan2wan-httpsOnly
# Zakazat komunikaci na cilove adresy: 93.197.191.193, 87.207.18.53 a 31.123.141.17
add action=drop chain=LAN2WAN dst-address-list=lan2wan-blockedDstAddr
# Veskery ostatni provoz bude povolen
add action=accept chain=LAN2WAN

#WAN -> LAN
# Povolit Remote Desktop odkudkoliv na adresy vnitrni site (LAN), ktere maji na konci .132 a .114
add action=accept chain=forward dst-address-list=wan2lan-rdpAllowed dst-port=3389 in-interface=WAN out-interface=LAN protocol=tcp
# Povolit Remote Desktop ze zdrojove adresy 80.246.105.77 na adresu vnitrni site (LAN), ktera ma na konci .22
add action=accept chain=forward dst-address=192.168.244.22 dst-port=3389 in-interface=WAN out-interface=LAN protocol=tcp src-address=80.246.105.77
# Povolit Telnet odkudkoliv na adresy vnitrni site (LAN), ktere maji na konci .41 a .57
add action=accept chain=forward dst-address-list=wan2lan-telnet dst-port=23 in-interface=WAN out-interface=LAN protocol=tcp
# Povolit veskerou komunikaci z nasledujicich zdrojovych adres: 54.31.73.188, 121.241.229.2,126.200.175.244, 213.154.50.137 a 74.121.58.68.
add action=accept chain=forward in-interface=WAN out-interface=LAN src-address-list=wan2lan-allowAll
# Veskery ostatni provoz bude zakazan.
add action=drop chain=forward in-interface=WAN out-interface=LAN

#WAN -> DMZ
# Povolit VNC ze zdrojovych adres 139.95.186.0/24, 118.220.155.77 a 186.223.69.39 na adresu z DMZ, ktera ma na konci .19
add action=accept chain=forward dst-address=172.26.154.19 dst-port=5900 in-interface=WAN out-interface=DMZ protocol=tcp src-address-list=wan2dmz-allowVNC
# Povolit transportni protokol(y) a port(y) pro MAILovy (protokoly POP3, IMAP4, SMTP a jejich zabezpecene variatny) server v DMZ siti s adresou, ktera ma na konci .163
add action=accept chain=forward dst-address=172.26.154.163 dst-port=25,110,143,465,993,995,587,2525 in-interface=WAN out-interface=DMZ protocol=tcp
# Povolit veskerou komunikaci ze zdrojovych adres 44.143.11.0/24, 82.178.33.0/24 a 129.64.0.0/16 na cilovou adresu z DMZ s koncovkou .122
add action=accept chain=forward dst-address=172.26.154.122 in-interface=WAN out-interface=DMZ src-address-list=wan2dmz-allowAll
# Povolit transportni protokol(y) a port(y) pro autentizacni server vyuzivajici LDAP a Radius v DMZ siti s adresou, ktera ma na konci .181
add action=accept chain=forward dst-address=172.26.154.181 dst-port=389,636,1812,1813 in-interface=WAN out-interface=DMZ protocol=tcp
# Veskery ostatni provoz bude zakazan
add action=drop chain=forward in-interface=WAN out-interface=DMZ

#DMZ -> WAN
# Povolit pouzivani e-mailu (SMTP, IMAP, POP3 a jejich zabezpecene variatny) z DMZ adresy s koncovkou .89.
add action=accept chain=forward dst-port=25,110,143,465,993,995,587,2525 in-interface=DMZ out-interface=WAN protocol=tcp src-address=172.26.154.89
# Povolit pouzivani DNS z DMZ adresy s koncovkou .88.
add action=accept chain=forward  dst-port=53 in-interface=DMZ out-interface=WAN protocol=udp src-address=172.26.154.88
# Povolit pristup na MySQL a PostgreSQL databaze z DMZ adresy s koncovkou .82
add action=accept chain=forward dst-port=5432,3306 in-interface=DMZ out-interface=WAN protocol=tcp src-address=172.26.154.82
# Veskery ostatni provoz bude zakazan.
add action=drop chain=forward in-interface=DMZ out-interface=WAN

#LAN -> DMZ
# Povolit VNC ze zdrojovych adres 139.95.186.0/24, 118.220.155.77 a 186.223.69.39 na adresu z DMZ, ktera ma na konci .19
add action=accept chain=forward dst-address=172.26.154.19 dst-port=5900 in-interface=LAN out-interface=DMZ protocol=tcp src-address-list=lan2dmz-allowVNC
# Povolit transportni protokol(y) a port(y) pro MAILovy (protokoly POP3, IMAP4, SMTP a jejich zabezpecene variatny) server v DMZ siti s adresou, ktera ma na konci .163
add action=accept chain=forward dst-address=172.26.154.163 dst-port=25,110,143,465,993,995,587,2525 in-interface=LAN out-interface=DMZ protocol=tcp
# Povolit veskerou komunikaci ze zdrojovych adres 44.143.11.0/24, 82.178.33.0/24 a 129.64.0.0/16 na cilovou adresu z DMZ s koncovkou .122
add action=accept chain=forward dst-address=172.26.154.122 in-interface=LAN out-interface=DMZ src-address-list=lan2dmz-allowAll
# Povolit transportni protokol(y) a port(y) pro autentizacni server vyuzivajici LDAP a Radius v DMZ siti s adresou, ktera ma na konci .181
add action=accept chain=forward dst-address=172.26.154.181 dst-port=389,636,1812,1813 in-interface=LAN out-interface=DMZ protocol=tcp
# Povolit Remote Desktop z adres ve vnitrni siti (LAN), ktere maji na konci .26 a .114 na adresu v DMZ s koncovkou .37
add action=accept chain=forward dst-address=172.26.154.37 dst-port=3389 in-interface=LAN out-interface=DMZ protocol=tcp src-address-list=lan2dmz-rdpLANsrc
# Veskery ostatni provoz bude zakazan
add action=drop chain=forward in-interface=LAN out-interface=DMZ

#DMZ -> LAN
# Povolit SNMP na adresu vnitrni site (LAN) s koncovkou .209
add action=accept chain=forward dst-address=192.168.244.209 dst-port=161 in-interface=DMZ out-interface=LAN protocol=udp
# Povolit DNS na adresu vnitrni site (LAN) s koncovkou .68
add action=accept chain=forward dst-address=192.168.244.68 dst-port=53 in-interface=DMZ out-interface=LAN protocol=udp
# Povolit FTP a SCP z DMZ adresy s koncovkou .85
add action=accept chain=forward dst-port=20,21,22 in-interface=DMZ out-interface=LAN protocol=tcp src-address=172.26.154.85
# Povolit NTP na adresu vnitrni site (LAN) s koncovkou .247
add action=accept chain=forward dst-address=192.168.244.247 dst-port=123 in-interface=DMZ out-interface=LAN protocol=udp
# Veskery ostatni provoz bude zakazan
add action=drop chain=forward in-interface=DMZ out-interface=LAN

#MGMT
# Stavovy firewall - input chain
add action=accept chain=input connection-state=established,related
add action=drop chain=input connection-state=invalid
# Povolit vse z rozhrani ether4 (MGMT)
add action=accept chain=input in-interface=MGMT
# Povolit NTP z DMZ site.
add action=accept chain=input dst-port=123 in-interface=DMZ protocol=udp
# Povolit VPN protokol L2TP/IPsec z WAN adresy 84.227.105.180.
add action=accept chain=input dst-port=500,1701,4500 in-interface=WAN protocol=udp src-address=84.227.105.180
# Veskery ostatni provoz bude zakazan
add action=drop chain=input

/ip route
add dst-address=0.0.0.0/0 gateway=111.26.90.254 check-gateway=ping

/system note
set show-at-login=no
