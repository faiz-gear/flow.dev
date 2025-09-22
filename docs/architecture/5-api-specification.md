# 5. API Specification

This OpenAPI 3.0 specification describes the user-facing RESTful API implemented via Next.js API Routes.

```yaml
openapi: 3.0.1
info:
  title: "flow.dev API"
  version: "1.0.0"
  description: "API for user management and configuration for the flow.dev application."
servers:
  - url: "/api"
    description: "Relative path for API routes"
paths:
  /user/profile:
    get:
      summary: "Get current user's profile"
      security:
        - cookieAuth: []
      responses:
        '200':
          description: "Successful response"
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserProfile'
        '401':
          description: "Unauthorized"
    patch:
      summary: "Update user's profile"
      security:
        - cookieAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                report_email:
                  type: string
                  format: email
      responses:
        '200':
          description: "Profile updated successfully"
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserProfile'
        '400':
          description: "Bad Request - Invalid email format"
        '401':
          description: "Unauthorized"
components:
  schemas:
    UserProfile:
      type: object
      properties:
        id:
          type: string
          format: uuid
        report_email:
          type: string
          format: email
  securitySchemes:
    cookieAuth:
      type: apiKey
      in: cookie
      name: "sb-access-token"
```

-----
