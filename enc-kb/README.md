# RouterOS Firewall Configuration - Network Security

**Course:** ENC-KB (Cyber Security)  
**Institution:** Mendel University  

## Description

This repository contains RouterOS firewall configuration files and documentation related to network security implementation. The project focuses on understanding firewall concepts, network segmentation, and practical implementation of secure network infrastructure using MikroTik RouterOS.

## Contents

- `xpospi27.rsc` - Complete RouterOS configuration file with firewall rules and network setup

## About RouterOS Firewall Configuration

RouterOS is a router operating system based on Linux that provides extensive networking and security features. This configuration implements a comprehensive firewall setup with multiple network zones and security policies.

## Learning Objectives

### Core Network Security Concepts
- **Understanding Defense in Depth**: Implement multiple layers of security controls including network segmentation, access control lists, and stateful firewall rules
- **Network Segmentation Principles**: Design and implement secure network zones (LAN, WAN, DMZ, MGMT) with appropriate isolation and controlled inter-zone communication
- **Stateful Firewall Implementation**: Configure connection state tracking for established, related, and invalid connections to enhance security

### RouterOS Configuration and Management
- **Interface Configuration**: Set up and manage multiple network interfaces with proper IP addressing and naming conventions
- **Address List Management**: Create and maintain comprehensive address lists for efficient traffic filtering and access control
- **Firewall Chain Architecture**: Understand and implement custom firewall chains (LAN2WAN) for specialized traffic processing

### Advanced Traffic Control and Filtering
- **Protocol-Specific Filtering**: Implement granular control over email protocols (SMTP, POP3, IMAP4) and their secure variants (SMTPS, POP3S, IMAPS)
- **Port-Based Access Control**: Configure specific port restrictions for services like Remote Desktop (RDP), Telnet, VNC, LDAP, RADIUS, and database connections
- **Source and Destination Filtering**: Apply sophisticated rules based on source/destination IP addresses and network ranges

### Network Service Security
- **DMZ Security Implementation**: Secure public-facing services in a demilitarized zone with controlled access from internal and external networks
- **VPN Configuration**: Set up L2TP/IPsec VPN access with proper authentication and encryption protocols
- **Management Network Security**: Implement secure administrative access through dedicated management interfaces

### Security Policy Design
- **Principle of Least Privilege**: Apply minimal necessary access permissions across all network zones and services
- **Default Deny Strategy**: Implement comprehensive default-deny policies with specific allow rules for required services
- **Traffic Flow Analysis**: Understand and control bidirectional traffic patterns between different network zones

### Practical Implementation Skills
- **RouterOS Command Line**: Master RouterOS configuration syntax and command structure for firewall rules and network setup
- **Network Troubleshooting**: Develop skills in analyzing firewall logs and diagnosing connectivity issues
- **Configuration Management**: Learn best practices for backing up, documenting, and maintaining network security configurations

### Real-World Security Scenarios
- **Email Security**: Implement comprehensive email protocol filtering to prevent unauthorized SMTP communication
- **Remote Access Security**: Configure secure remote desktop and VPN access with proper authentication controls
- **Database Security**: Implement secure database access controls for MySQL and PostgreSQL services
- **Authentication Services**: Secure LDAP and RADIUS authentication servers with appropriate access controls

## Acknowledgments

- MikroTik for providing comprehensive networking solutions
- Mendel University for the course materials and guidance
- The networking community for security best practices and documentation