# Overview

This is an AI-powered lead generation and automated calling system that integrates with ElevenLabs' conversational AI platform. The application stores lead information and triggers automated phone calls using ElevenLabs' voice agents to engage with prospects.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Backend Architecture
- **Node.js/Express Server**: Simple REST API server handling lead storage and call initiation
- **In-Memory Data Storage**: Leads are stored in a JavaScript object using phone numbers as unique keys
- **Stateless Design**: No persistent database, data exists only during server runtime

## API Design
- **Single Endpoint Pattern**: `/storeLeadData` POST endpoint handles both lead storage and call triggering
- **Validation Layer**: Basic input validation for required fields (firstName, phone)
- **Error Handling**: HTTP status codes for validation failures

## Data Model
Lead objects contain:
- Contact information (firstName, lastName, phone)
- Business context (companyName, website, industry, businessDetails)
- Phone number serves as primary key for storage and retrieval

## Integration Architecture
- **ElevenLabs Voice AI**: External service for conversational AI phone calls
- **Environment-Based Configuration**: API keys and agent IDs stored as environment variables
- **Outbound Call Triggering**: Automated call initiation after lead storage

# External Dependencies

## Core Dependencies
- **Express.js**: Web framework for REST API server
- **Axios**: HTTP client for making API calls to ElevenLabs
- **Body-parser**: Middleware for parsing JSON request bodies

## Third-Party Services
- **ElevenLabs Conversational AI**: Voice agent platform for automated phone calls
  - Requires: API key, Agent ID, and Agent Phone Number ID
  - Purpose: Initiating outbound calls to stored leads

## Environment Variables
- `ELEVENLABS_API_KEY`: Authentication for ElevenLabs API
- `ELEVENLABS_AGENT_ID`: Specific AI agent configuration
- `ELEVENLABS_AGENT_PHONE_NUMBER_ID`: Phone number for outbound calls
- `PORT`: Server port configuration (defaults to 3001)