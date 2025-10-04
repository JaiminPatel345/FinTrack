### E2E Tests
- Test complete user journeys
- Test approval workflows with different rules
- Test OCR processing and auto-fill
- Test currency conversion flows

### Manual Testing Checklist
- All user roles (Admin, Manager, Employee)
- All approval rule types
- File upload and OCR accuracy
- Email delivery
- Mobile responsiveness
- Cross-browser compatibility
- Error scenarios and edge cases

---

## Performance Optimization

### Database Optimization
- Create proper indexes on frequently queried columns
- Use connection pooling
- Implement query result caching for static data
- Use database views for complex joins
- Optimize N+1 queries with proper eager loading

### API Optimization
- Implement pagination for list endpoints
- Use field selection to return only needed data
- Cache frequently accessed data in Redis
- Compress responses with gzip
- Use HTTP/2 if possible

### Frontend Optimization
- Lazy load routes and components
- Implement virtual scrolling for long lists
- Optimize images (use WebP format, proper sizing)
- Code splitting for smaller bundle sizes
- Debounce search inputs
- Cache API responses in memory
- Use React.memo for expensive components
- Implement optimistic UI updates

### File Upload Optimization
- Client-side image compression before upload
- Upload directly to Cloudinary (not through backend)
- Show upload progress
- Support multiple file uploads
- Implement retry on failure

---

## Deployment Considerations

### Environment Variables
Each service needs proper environment configuration for:
- Database connections
- API keys and secrets
- Service URLs
- CORS origins
- Email credentials
- File storage credentials

### Database Migrations
- Use migration scripts for schema changes
- Version control all migrations
- Test migrations in staging before production
- Implement rollback procedures
- Seed data for testing

### Service Health Checks
Implement health check endpoints for each service:
- GET /health: Returns service status
- Check database connectivity
- Check external API availability
- Return detailed status for debugging

### Logging Strategy
- Use structured logging (JSON format)
- Log levels: ERROR, WARN, INFO, DEBUG
- Include request IDs for tracing
- Log all authentication attempts
- Log all state changes (expense submissions, approvals)
- Aggregate logs centrally for analysis

### Monitoring
- Track API response times
- Monitor database query performance
- Track queue job processing times
- Monitor error rates
- Set up alerts for critical issues
- Track user activity metrics

### Backup Strategy
- Daily automated backups of PostgreSQL
- Backup MongoDB collections
- Store backups in separate location
- Test restore procedures regularly
- Document backup/restore process

---

## Error Handling Patterns

### API Error Responses
Standardized error response format:
- Status code (400, 401, 403, 404, 500)
- Error message (user-friendly)
- Error code (for programmatic handling)
- Field errors (for validation)
- Request ID (for debugging)
- Timestamp

### Frontend Error Display
- Show toast notifications for general errors
- Inline validation errors on forms
- Error boundaries for component crashes
- Retry buttons for network failures
- Helpful error messages with next steps
- Support contact information for critical errors

### Graceful Degradation
- If OCR fails, allow manual entry
- If currency API fails, use cached rates
- If email fails, queue for retry
- If notification fails, show in-app only
- Provide fallback UI when features unavailable

---

## Documentation Requirements

### API Documentation
- OpenAPI/Swagger specification for all endpoints
- Request/response examples
- Authentication requirements
- Error codes and meanings
- Rate limits and pagination
- Webhook documentation (if applicable)

### Database Documentation
- ER diagrams showing relationships
- Table descriptions and purpose
- Column descriptions and constraints
- Index documentation
- Migration history

### Deployment Documentation
- Environment setup instructions
- Service deployment steps
- Configuration requirements
- Troubleshooting guide
- Monitoring and alerting setup

### User Documentation
- User guides for each role
- Feature tutorials with screenshots
- FAQ section
- Video tutorials (optional)
- Contact support information

---

## Future Enhancements (Not in Core)

### Potential Features to Add Later
- Budget tracking and limits
- Expense policy engine
- Mobile app (React Native)
- Advanced reporting and analytics
- Integration with accounting software
- Mileage tracking with GPS
- Receipt scanning from mobile camera
- Multi-language support
- Advanced audit trail with timeline
- Expense forecasting
- Automated recurring expenses
- Split expenses across projects
- Vendor management
- Contract and invoice management

---

## Development Workflow

### Git Workflow
- Main branch for production-ready code
- Develop branch for integration
- Feature branches for new features
- Commit message conventions
- Pull request review process
- CI/CD pipeline for automated testing

### Code Review Checklist
- Code follows style guide
- All tests pass
- No security vulnerabilities
- Performance considerations
- Error handling implemented
- Documentation updated
- No hardcoded values
- Proper logging added

### Release Process
1. Create release branch from develop
2. Run full test suite
3. Update version numbers
4. Update changelog
5. Deploy to staging
6. Perform smoke tests
7. Deploy to production
8. Monitor for issues
9. Tag release in git

---

## Quick Start Guide for AI

### Implementation Priority Order
1. **Setup infrastructure**: Databases, folders, shared types
2. **Build auth service**: Signup, signin, password reset
3. **Build user service**: User management, manager relationships
4. **Build frontend auth**: Login, signup pages with country dropdown
5. **Build expense service**: CRUD operations, categories
6. **Integrate Cloudinary**: File upload functionality
7. **Build frontend expenses**: List, create, edit forms
8. **Build OCR service**: Text extraction and parsing
9. **Integrate queue**: Job publishing and workers
10. **Build currency service**: Rate fetching and conversion
11. **Build approval service**: Rules, workflow execution
12. **Build frontend approvals**: Rules config, pending approvals
13. **Build notification service**: Email sending, templates
14. **Add real-time updates**: Polling or WebSocket
15. **Polish UI**: Animations, responsive design, error states
16. **Testing**: Unit, integration, E2E tests
17. **Documentation**: API docs, deployment guide
18. **Performance optimization**: Caching, indexing, bundling

### Critical Implementation Notes
- All amounts must use DECIMAL type, never FLOAT (financial accuracy)
- Always validate user's company_id matches resource being accessed (security)
- Store both original and converted currency amounts (audit trail)
- Use UUIDs for all primary keys (distributed system ready)
- Implement soft deletes with is_active flags (data retention)
- Log all state changes in audit table (compliance)
- Use transactions for multi-step operations (data integrity)
- Sanitize all user inputs (security)
- Rate limit all public endpoints (DDoS protection)
- Use connection pooling for databases (performance)

### Common Pitfalls to Avoid
- Don't expose internal IDs in URLs or responses
- Don't trust client-side validation alone
- Don't store sensitive data in JWT tokens
- Don't use localStorage for tokens in production
- Don't hardcode service URLs, use environment variables
- Don't skip error handling in async operations
- Don't forget to close database connections
- Don't use synchronous operations in async code
- Don't skip input validation on backend
- Don't return detailed error messages to clients (security)

### Data Flow Summary
1. User uploads receipt → Cloudinary → URL stored in expense
2. Expense created → Queue OCR job → Python service processes → MongoDB result → Update expense
3. Expense submitted → Find approval rule → Create approval chain → Notify first approver
4. Approver approves → Check rule type → Move to next step or complete → Notify employee
5. Currency conversion → Check Redis → Check database → Call external API → Cache result

---

## Final Checklist Before Deployment

### Backend Checklist
- [ ] All services running and healthy
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] API Gateway routing correctly
- [ ] Authentication working (signup, signin, forgot password)
- [ ] User management CRUD working
- [ ] Expense CRUD working
- [ ] Receipt upload to Cloudinary working
- [ ] OCR processing working
- [ ] Currency conversion working
- [ ] Approval rules configuration working
- [ ] Approval workflow execution working
- [ ] Email sending working
- [ ] Queue jobs processing
- [ ] Logging implemented
- [ ] Error handling implemented
- [ ] Security measures in place
- [ ] Performance optimization done

### Frontend Checklist
- [ ] All pages rendering correctly
- [ ] Authentication flow working
- [ ] Protected routes implemented
- [ ] User management UI working
- [ ] Expense list and filters working
- [ ] Expense form with validation working
- [ ] Receipt upload with preview working
- [ ] OCR auto-fill working
- [ ] Approval rules UI working
- [ ] Pending approvals UI working
- [ ] Notifications working
- [ ] Responsive design tested
- [ ] Cross-browser compatibility tested
- [ ] Loading states implemented
- [ ] Error states implemented
- [ ] Success messages implemented
- [ ] Custom design system applied
- [ ] Animations subtle and professional

### Integration Checklist
- [ ] Frontend connecting to API Gateway
- [ ] Authentication tokens working
- [ ] File uploads working end-to-end
- [ ] OCR processing end-to-end working
- [ ] Approval workflow end-to-end working
- [ ] Email notifications received
- [ ] Currency conversion accurate
- [ ] All user roles functioning correctly
- [ ] Data persistence working
- [ ] Audit logs being created

### Testing Checklist
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] Manual testing completed
- [ ] Edge cases handled
- [ ] Error scenarios tested
- [ ] Performance tested under load
- [ ] Security vulnerabilities checked

---

## Support and Maintenance

### Monitoring Alerts
Set up alerts for:
- Service downtime
- High error rates# Expense Management System - Implementation Prompt

## Project Overview
Build a microservices-based expense management system with React.js frontend, Node.js backend services, Python OCR service, and PostgreSQL/MongoDB databases. The system handles multi-currency expenses with configurable approval workflows.

---

## Tech Stack

### Frontend
- **Framework**: React.js 18+ with TypeScript
- **Styling**: Tailwind CSS (custom configuration with brand colors)
- **Animations**: Framer Motion (subtle, non-obvious usage)
- **State Management**: React Context API + Custom Hooks
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod validation
- **Routing**: React Router v6
- **Date Handling**: date-fns
- **File Upload**: React Dropzone

### Backend Services
- **API Gateway**: Node.js + Express + TypeScript
- **Auth Service**: Node.js + Express + JWT + bcrypt
- **User Management Service**: Node.js + Express
- **Expense Service**: Node.js + Express
- **Approval Workflow Service**: Node.js + Express
- **Currency Service**: Node.js + Express + node-cron
- **OCR Service**: Python + Flask + Tesseract OCR / EasyOCR
- **Notification Service**: Node.js + Express + Nodemailer
- **Message Queue**: PostgreSQL with pg-boss (job queue)

### Databases
- **PostgreSQL**: Auth, Users, Expenses, Approvals, Currency
- **MongoDB**: Audit Logs, OCR Results, Notifications

### File Storage
- **Cloudinary**: Receipt images in `/expense_management/receipts/` folder

### Email Service
- **Nodemailer**: Gmail SMTP with app password

---

## Folder Structure

```
expense-management-system/
│
├── client/                                 # React Frontend
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── assets/                        # Images, icons, fonts
│   │   │   ├── icons/
│   │   │   ├── images/
│   │   │   └── fonts/
│   │   │
│   │   ├── components/                    # Reusable components
│   │   │   ├── common/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── SearchableSelect.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Table.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Loader.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   └── FileUpload.tsx
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── DashboardLayout.tsx
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── SignupForm.tsx
│   │   │   │   ├── SigninForm.tsx
│   │   │   │   ├── ForgotPasswordForm.tsx
│   │   │   │   └── ResetPasswordForm.tsx
│   │   │   │
│   │   │   ├── users/
│   │   │   │   ├── UsersTable.tsx
│   │   │   │   ├── UserModal.tsx
│   │   │   │   └── SendPasswordModal.tsx
│   │   │   │
│   │   │   ├── expenses/
│   │   │   │   ├── ExpenseList.tsx
│   │   │   │   ├── ExpenseForm.tsx
│   │   │   │   ├── ExpenseCard.tsx
│   │   │   │   ├── ReceiptUpload.tsx
│   │   │   │   ├── StatusTimeline.tsx
│   │   │   │   └── ExpenseFilters.tsx
│   │   │   │
│   │   │   └── approvals/
│   │   │       ├── ApprovalRulesForm.tsx
│   │   │       ├── ApprovalsList.tsx
│   │   │       ├── ApprovalCard.tsx
│   │   │       ├── ApprovalModal.tsx
│   │   │       └── ApproverSequence.tsx
│   │   │
│   │   ├── pages/                         # Page components
│   │   │   ├── auth/
│   │   │   │   ├── Signup.tsx
│   │   │   │   ├── Signin.tsx
│   │   │   │   ├── ForgotPassword.tsx
│   │   │   │   └── ResetPassword.tsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── ManagerDashboard.tsx
│   │   │   │   └── EmployeeDashboard.tsx
│   │   │   │
│   │   │   ├── users/
│   │   │   │   └── UsersManagement.tsx
│   │   │   │
│   │   │   ├── expenses/
│   │   │   │   ├── ExpensesList.tsx
│   │   │   │   ├── CreateExpense.tsx
│   │   │   │   ├── EditExpense.tsx
│   │   │   │   └── ExpenseDetails.tsx
│   │   │   │
│   │   │   └── approvals/
│   │   │       ├── ApprovalRules.tsx
│   │   │       └── PendingApprovals.tsx
│   │   │
│   │   ├── hooks/                         # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useUsers.ts
│   │   │   ├── useExpenses.ts
│   │   │   ├── useApprovals.ts
│   │   │   ├── useCurrency.ts
│   │   │   ├── useNotifications.ts
│   │   │   ├── useDebounce.ts
│   │   │   └── useToast.ts
│   │   │
│   │   ├── context/                       # React Context
│   │   │   ├── AuthContext.tsx
│   │   │   ├── ThemeContext.tsx
│   │   │   └── NotificationContext.tsx
│   │   │
│   │   ├── services/                      # API service calls
│   │   │   ├── api.ts                     # Axios instance
│   │   │   ├── auth.service.ts
│   │   │   ├── users.service.ts
│   │   │   ├── expenses.service.ts
│   │   │   ├── approvals.service.ts
│   │   │   ├── currency.service.ts
│   │   │   └── upload.service.ts
│   │   │
│   │   ├── utils/                         # Utility functions
│   │   │   ├── formatters.ts              # Date, currency formatters
│   │   │   ├── validators.ts              # Form validators
│   │   │   ├── constants.ts               # App constants
│   │   │   └── helpers.ts                 # Helper functions
│   │   │
│   │   ├── types/                         # TypeScript types (shared)
│   │   │   ├── auth.types.ts
│   │   │   ├── user.types.ts
│   │   │   ├── expense.types.ts
│   │   │   ├── approval.types.ts
│   │   │   ├── currency.types.ts
│   │   │   └── common.types.ts
│   │   │
│   │   ├── styles/                        # Global styles
│   │   │   ├── globals.css
│   │   │   ├── animations.css
│   │   │   └── themes.css
│   │   │
│   │   ├── App.tsx                        # Main App component
│   │   ├── main.tsx                       # Entry point
│   │   └── routes.tsx                     # Route configuration
│   │
│   ├── .env.example
│   ├── .eslintrc.js
│   ├── .prettierrc
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── server/                                 # Backend Services
│   │
│   ├── shared/                            # Shared code across services
│   │   ├── types/                         # TypeScript types
│   │   │   ├── auth.types.ts
│   │   │   ├── user.types.ts
│   │   │   ├── expense.types.ts
│   │   │   ├── approval.types.ts
│   │   │   ├── currency.types.ts
│   │   │   ├── notification.types.ts
│   │   │   └── common.types.ts
│   │   │
│   │   ├── utils/                         # Shared utilities
│   │   │   ├── logger.ts
│   │   │   ├── errors.ts
│   │   │   ├── validators.ts
│   │   │   └── constants.ts
│   │   │
│   │   ├── middleware/                    # Shared middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── logger.middleware.ts
│   │   │
│   │   └── database/                      # Database configs
│   │       ├── postgres.ts
│   │       └── mongodb.ts
│   │
│   ├── api-gateway/                       # API Gateway Service
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── users.routes.ts
│   │   │   │   ├── expenses.routes.ts
│   │   │   │   ├── approvals.routes.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── middleware/
│   │   │   │   ├── proxy.middleware.ts
│   │   │   │   ├── rate-limit.middleware.ts
│   │   │   │   └── cors.middleware.ts
│   │   │   │
│   │   │   ├── config/
│   │   │   │   ├── services.config.ts
│   │   │   │   └── proxy.config.ts
│   │   │   │
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   │
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── auth-service/                      # Authentication Service
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   └── auth.controller.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts
│   │   │   │
│   │   │   ├── models/
│   │   │   │   ├── user.model.ts
│   │   │   │   └── company.model.ts
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   └── auth.routes.ts
│   │   │   │
│   │   │   ├── middleware/
│   │   │   │   └── jwt.middleware.ts
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   ├── jwt.util.ts
│   │   │   │   ├── password.util.ts
│   │   │   │   └── email.util.ts
│   │   │   │
│   │   │   ├── config/
│   │   │   │   └── database.config.ts
│   │   │   │
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   │
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── user-service/                      # User Management Service
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   └── user.controller.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   └── user.service.ts
│   │   │   │
│   │   │   ├── models/
│   │   │   │   ├── user.model.ts
│   │   │   │   └── manager-relationship.model.ts
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   └── user.routes.ts
│   │   │   │
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   │
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── expense-service/                   # Expense Management Service
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   ├── expense.controller.ts
│   │   │   │   └── category.controller.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── expense.service.ts
│   │   │   │   └── category.service.ts
│   │   │   │
│   │   │   ├── models/
│   │   │   │   ├── expense.model.ts
│   │   │   │   ├── expense-line-item.model.ts
│   │   │   │   └── category.model.ts
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   ├── expense.routes.ts
│   │   │   │   └── category.routes.ts
│   │   │   │
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   │
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── approval-service/                  # Approval Workflow Service
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   ├── approval-rule.controller.ts
│   │   │   │   └── approval.controller.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── approval-rule.service.ts
│   │   │   │   └── approval.service.ts
│   │   │   │
│   │   │   ├── models/
│   │   │   │   ├── approval-rule.model.ts
│   │   │   │   ├── approval-step.model.ts
│   │   │   │   ├── expense-approval.model.ts
│   │   │   │   └── approval-action.model.ts
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   ├── approval-rule.routes.ts
│   │   │   │   └── approval.routes.ts
│   │   │   │
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   │
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── currency-service/                  # Currency Conversion Service
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   └── currency.controller.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   └── currency.service.ts
│   │   │   │
│   │   │   ├── models/
│   │   │   │   └── exchange-rate.model.ts
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   └── currency.routes.ts
│   │   │   │
│   │   │   ├── jobs/
│   │   │   │   └── sync-rates.job.ts
│   │   │   │
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   │
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── ocr-service/                       # OCR Service (Python)
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   └── ocr_controller.py
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── ocr_service.py
│   │   │   │   └── receipt_parser.py
│   │   │   │
│   │   │   ├── models/
│   │   │   │   └── ocr_result.py
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   ├── image_processor.py
│   │   │   │   └── text_extractor.py
│   │   │   │
│   │   │   ├── config/
│   │   │   │   └── database.py
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   └── ocr_routes.py
│   │   │   │
│   │   │   ├── app.py
│   │   │   └── server.py
│   │   │
│   │   ├── requirements.txt
│   │   ├── .env.example
│   │   └── README.md
│   │
│   ├── notification-service/              # Notification Service
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   └── notification.controller.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── notification.service.ts
│   │   │   │   └── email.service.ts
│   │   │   │
│   │   │   ├── models/
│   │   │   │   └── notification.model.ts
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   └── notification.routes.ts
│   │   │   │
│   │   │   ├── templates/
│   │   │   │   ├── welcome.html
│   │   │   │   ├── reset-password.html
│   │   │   │   ├── expense-submitted.html
│   │   │   │   ├── expense-approved.html
│   │   │   │   └── expense-rejected.html
│   │   │   │
│   │   │   ├── config/
│   │   │   │   └── nodemailer.config.ts
│   │   │   │
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   │
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── queue-service/                     # Message Queue (pg-boss)
│       ├── src/
│       │   ├── workers/
│       │   │   ├── ocr-processor.worker.ts
│       │   │   ├── email.worker.ts
│       │   │   └── approval.worker.ts
│       │   │
│       │   ├── config/
│       │   │   └── queue.config.ts
│       │   │
│       │   ├── app.ts
│       │   └── server.ts
│       │
│       ├── .env.example
│       ├── package.json
│       └── tsconfig.json
│
├── database/                              # Database scripts
│   ├── postgres/
│   │   ├── migrations/
│   │   │   ├── 001_create_companies.sql
│   │   │   ├── 002_create_users.sql
│   │   │   ├── 003_create_manager_relationships.sql
│   │   │   ├── 004_create_expense_categories.sql
│   │   │   ├── 005_create_expenses.sql
│   │   │   ├── 006_create_expense_line_items.sql
│   │   │   ├── 007_create_approval_rules.sql
│   │   │   ├── 008_create_approval_steps.sql
│   │   │   ├── 009_create_expense_approvals.sql
│   │   │   ├── 010_create_approval_actions.sql
│   │   │   ├── 011_create_exchange_rates.sql
│   │   │   └── 012_create_pgboss_tables.sql
│   │   │
│   │   └── seeds/
│   │       ├── categories.sql
│   │       └── test-data.sql
│   │
│   └── mongodb/
│       ├── collections/
│       │   ├── audit_logs.js
│       │   ├── ocr_results.js
│       │   └── notifications.js
│       │
│       └── indexes/
│           ├── audit_logs.indexes.js
│           ├── ocr_results.indexes.js
│           └── notifications.indexes.js
│
├── docs/                                  # Documentation
│   ├── API.md
│   ├── DATABASE.md
│   ├── DEPLOYMENT.md
│   └── ARCHITECTURE.md
│
├── .gitignore
├── docker-compose.yml
├── README.md
└── package.json (root workspace)
```

---

## Database Schema Design

### PostgreSQL Schema

#### 1. Companies Table
```sql
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_approval_actions_expense_approval ON approval_actions(expense_approval_id);
CREATE INDEX idx_approval_actions_approver ON approval_actions(approver_id);
CREATE INDEX idx_approval_actions_action ON approval_actions(action);
```

#### 11. Exchange Rates Table
```sql
CREATE TABLE exchange_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    base_currency VARCHAR(3) NOT NULL,
    target_currency VARCHAR(3) NOT NULL,
    rate DECIMAL(15, 6) NOT NULL,
    effective_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(base_currency, target_currency, effective_date)
);

CREATE INDEX idx_exchange_rates_currencies ON exchange_rates(base_currency, target_currency);
CREATE INDEX idx_exchange_rates_date ON exchange_rates(effective_date);
```

---

### MongoDB Schema

#### 1. Audit Logs Collection
```javascript
{
    _id: ObjectId,
    company_id: UUID,
    user_id: UUID,
    entity_type: String, // "expense", "user", "approval", "company"
    entity_id: UUID,
    action: String, // "create", "update", "delete", "approve", "reject"
    changes: {
        field_name: {
            old_value: Mixed,
            new_value: Mixed
        }
    },
    ip_address: String,
    user_agent: String,
    timestamp: ISODate,
    metadata: Object
}

// Indexes
db.audit_logs.createIndex({ company_id: 1, timestamp: -1 });
db.audit_logs.createIndex({ user_id: 1, timestamp: -1 });
db.audit_logs.createIndex({ entity_type: 1, entity_id: 1 });
db.audit_logs.createIndex({ timestamp: -1 });
```

#### 2. OCR Results Collection
```javascript
{
    _id: ObjectId,
    expense_id: UUID,
    company_id: UUID,
    user_id: UUID,
    
    // Receipt Image
    receipt_url: String,
    file_name: String,
    file_size: Number,
    
    // OCR Processing
    ocr_status: String, // "pending", "processing", "completed", "failed"
    ocr_provider: String, // "tesseract", "easyocr"
    
    // Extracted Data
    extracted_data: {
        vendor_name: String,
        vendor_address: String,
        date: String,
        total_amount: Number,
        currency: String,
        tax_amount: Number,
        line_items: [
            {
                description: String,
                quantity: Number,
                unit_price: Number,
                amount: Number
            }
        ],
        payment_method: String,
        receipt_number: String
    },
    
    // Confidence Scores
    confidence_scores: {
        overall: Number,
        vendor_name: Number,
        date: Number,
        amount: Number
    },
    
    // Raw OCR Output
    raw_text: String,
    
    // Metadata
    processing_time_ms: Number,
    processed_at: ISODate,
    created_at: ISODate
}

// Indexes
db.ocr_results.createIndex({ expense_id: 1 });
db.ocr_results.createIndex({ company_id: 1, created_at: -1 });
db.ocr_results.createIndex({ ocr_status: 1 });
```

#### 3. Notifications Collection
```javascript
{
    _id: ObjectId,
    company_id: UUID,
    user_id: UUID,
    
    // Notification Details
    type: String, // "expense_submitted", "approval_pending", "expense_approved", "expense_rejected", "password_reset"
    title: String,
    message: String,
    
    // Related Entity
    entity_type: String, // "expense", "approval"
    entity_id: UUID,
    
    // Channel
    channels: [String], // ["in_app", "email"]
    
    // Status
    is_read: Boolean,
    read_at: ISODate,
    
    // Delivery Status
    email_sent: Boolean,
    email_sent_at: ISODate,
    email_error: String,
    
    // Metadata
    priority: String, // "low", "medium", "high"
    created_at: ISODate,
    expires_at: ISODate
}

// Indexes
db.notifications.createIndex({ user_id: 1, created_at: -1 });
db.notifications.createIndex({ user_id: 1, is_read: 1 });
db.notifications.createIndex({ created_at: -1 });
db.notifications.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 }); // TTL index
```

---

## Core Features Implementation

### 1. Authentication & User Management

#### Signup Flow
1. User fills: Name, Email, Password, Confirm Password, Country (searchable dropdown)
2. Fetch countries from `https://restcountries.com/v3.1/all?fields=name,currencies`
3. Create Company with selected country's currency
4. Create Admin user with hashed password (bcrypt)
5. Send welcome email via Nodemailer
6. Auto-login with JWT token

#### Signin Flow
1. User enters Email, Password
2. Validate credentials
3. Generate JWT token (24h expiry)
4. Return user data + token
5. Store token in localStorage (client)

#### Forgot Password Flow
1. User enters email
2. Generate reset token (UUID) + expiry (1 hour)
3. Store in `users.reset_token` and `users.reset_token_expiry`
4. Send reset link via email: `http://frontend-url/reset-password?token={reset_token}`
5. User clicks link, enters new password
6. Validate token & expiry
7. Update password, clear token

#### User Management (Admin Only)
- View all users in company
- Create new user (Employee/Manager)
- Assign manager to employee
- Send password setup email (contains temp password or setup link)
- Change user roles
- Deactivate users (soft delete with `is_active = false`)

---

### 2. Expense Submission (Employee)

#### Create Expense Flow
1. **Receipt Upload**
   - User uploads receipt image via drag-drop or file picker
   - Upload to Cloudinary: `/expense_management/receipts/{company_id}/{expense_id}/`
   - Store `receipt_url` and `receipt_public_id`
   - Trigger OCR processing (async via queue)

2. **OCR Processing**
   - Queue job: `ocr-process`
   - Python service extracts: vendor, date, amount, currency, line items
   - Store results in MongoDB `ocr_results` collection
   - Update expense with extracted data
   - Set `ocr_processed = true` and `ocr_confidence` score

3. **Form Filling**
   - Auto-fill from OCR: Description, Amount, Currency, Date
   - User can edit/override OCR data
   - Additional fields: Category, Paid By, GST%, Remarks

4. **Currency Conversion**
   - If expense currency ≠ company currency
   - Fetch exchange rate from Currency Service
   - Calculate `converted_amount = amount × exchange_rate`
   - Store both original and converted amounts

5. **Save as Draft**
   - Status: `draft`
   - User can edit anytime

6. **Submit for Approval**
   - Validate all required fields
   - Status: `submitted`
   - Set `submitted_at` timestamp
   - Trigger approval workflow
   - Send notification to first approver
   - Create audit log entry

#### View Expense History
- Filter by status: All, Draft, Submitted, Pending Approval, Approved, Rejected
- Show timeline: Draft → Submitted → 50% Approved → 100% Approved
- Display in table: Description, Date, Category, Amount (company currency), Status
- Click to view details with approval history

---

### 3. Approval Workflow

#### Define Approval Rules (Admin)
1. **Rule Configuration**
   - Name: e.g., "Approval rule for miscellaneous expenses"
   - Description: Custom text explaining rule
   - Category: Optional (specific category or all)
   - Amount Threshold: Min/Max amount range

2. **Manager Approval Toggle**
   - "Is manager an approver?" (Yes/No)
   - If Yes: First approver is employee's manager from `manager_relationships`

3. **Sequential Approvers**
   - Add approvers in sequence (Step 1, 2, 3...)
   - Each step: Select user or role
   - Reorder steps with drag-drop or up/down buttons

4. **Percentage Rule**
   - Set minimum approval percentage (e.g., 60%)
   - If met, expense auto-approves

5. **Specific Approver Rule**
   - Mark specific approver (e.g., CFO) as auto-approve
   - If they approve, skip remaining steps

6. **Hybrid Rule**
   - Combine both: 60% OR CFO approves → Auto-approve

#### Approval Execution Flow
1. **On Expense Submit**
   - Find matching approval rule (by category, amount, priority)
   - Create `expense_approvals` record
   - Set `total_steps` based on rule configuration
   - If `is_manager_approver = true`: Add manager as Step 1
   - Add configured approvers as subsequent steps
   - Create `approval_actions` records for each step (status: pending)

2. **Approval Request to First Approver**
   - Send notification (in-app + email)
   - Add to their "Approvals to Review" queue

3. **Manager/Approver Actions**
   - View expense details
   - See amount in company currency (converted)
   - See approval history (who approved, when, comments)
   - Action: Approve or Reject with optional comments

4. **On Approve**
   - Update `approval_actions.action = 'approved'`
   - Update `approval_actions.action_date`
   - Check if more approvers needed:
     - **Sequential**: Move to next step, notify next approver
     - **Percentage**: Calculate approval percentage
       - If ≥ threshold: Mark expense as approved
       - Else: Continue
     - **Specific Approver**: If auto-approve user approved, complete
     - **Hybrid**: Check both conditions
   - If all approvers done or threshold met:
     - Update `expense_approvals.status = 'approved'`
     - Update `expenses.status = 'approved'`
     - Set `expense_approvals.completed_at`
     - Send notification to employee
     - Remove from all pending queues
     - Create audit log

5. **On Reject**
   - Update `approval_actions.action = 'rejected'`
   - Update `approval_actions.comments`
   - Update `expense_approvals.status = 'rejected'`
   - Update `expenses.status = 'rejected'`
   - Send notification to employee with reason
   - Remove from all pending queues
   - Create audit log

#### Pending Approvals (Manager View)
- Show all expenses waiting for their approval
- Table columns: Description, Employee Name, Category, Amount (converted), Status, Actions
- Filter by category, date range
- Sort by submission date
- Action buttons: Approve, Reject (opens modal for comments)

---

### 4. Currency Service

#### Fetch Exchange Rates
- Cron job runs daily at 00:00 UTC
- Fetch rates from `https://api.exchangerate-api.com/v4/latest/{company_currency}`
- Store in `exchange_rates` table
- Cache in Redis (key: `currency:{base}:{target}`, TTL: 24h)

#### Convert Amount
- API endpoint: `POST /currency/convert`
- Body: `{ amount, from_currency, to_currency, date }`
- Logic:
  1. Check Redis cache
  2. If not found, query `exchange_rates` table for date
  3. If not in DB, fetch from external API
  4. Calculate: `converted_amount = amount × rate`
  5. Return converted amount + rate

---

### 5. Notification Service

#### Email Templates (HTML)
- Welcome email (on signup)
- Password reset email (with link)
- Password setup email (for new users)
- Expense submitted (to first approver)
- Expense approved (to employee)
- Expense rejected (to employee with reason)
- Approval reminder (if pending > 3 days)

#### Nodemailer Configuration
```javascript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});
```

#### Send Email Flow
1. Queue job: `send-email` with payload
2. Worker picks job from queue
3. Render HTML template with data
4. Send via Nodemailer
5. Store notification in MongoDB
6. Update delivery status (sent/failed)
7. Create audit log

#### In-App Notifications
- Real-time via polling (every 30s) or WebSocket (optional)
- Fetch unread notifications: `GET /notifications?is_read=false`
- Mark as read: `PATCH /notifications/:id/read`
- Show badge count on header icon

---

## UI Design Requirements

### Color Palette (Custom Brand Colors)
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Main primary
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7', // Main secondary
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 20px -2px rgba(0, 0, 0, 0.1), 0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      },
    },
  },
}
```

### Animation Guidelines (Subtle Framer Motion)
```javascript
// Use subtle, professional animations
const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: "easeOut" }
};

const slideIn = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.4 }
};

const scaleIn = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.2 }
};

// Avoid: Heavy bounces, spins, complex 3D transforms
// Do: Simple fades, slides, scales with easeOut
```

### Component Styling Principles
1. **No Library-Specific Patterns**
   - Don't use Material-UI paper/card patterns
   - Don't use Ant Design's bordered style
   - Don't use Chakra's colorScheme prop pattern
   - Create custom, unique component styles

2. **Custom Design Elements**
   - Rounded corners: Use `rounded-xl` (12px) for cards
   - Borders: Use `border border-neutral-200` with subtle shadows
   - Hover states: Subtle scale(1.02) + shadow increase
   - Focus states: Custom ring color matching brand
   - Buttons: Gradient backgrounds with hover effects

3. **Typography**
   - Headings: `font-display` (Poppins)
   - Body: `font-sans` (Inter)
   - Sizes: Use consistent scale (text-sm, text-base, text-lg, text-xl, text-2xl)

4. **Spacing**
   - Consistent padding: `p-4, p-6, p-8`
   - Card spacing: `space-y-6`
   - Form fields: `space-y-4`

5. **Interactive Elements**
   - Buttons: Smooth color transitions (duration-200)
   - Inputs: Border color change on focus
   - Tables: Row hover with background color change
   - Modals: Backdrop blur effect

---

## API Endpoints

### Authentication Service
```
POST   /api/auth/signup                # Admin signup
POST   /api/auth/signin                # User signin
POST   /api/auth/forgot-password       # Request password reset
POST   /api/auth/reset-password        # Reset password with token
POST   /api/auth/verify-token          # Verify JWT token
POST   /api/auth/refresh-token         # Refresh JWT token
```

### User Service
```
GET    /api/users                      # Get all users (Admin)
GET    /api/users/:id                  # Get user by ID
POST   /api/users                      # Create user (Admin)
PUT    /api/users/:id                  # Update user
DELETE /api/users/:id                  # Deactivate user
POST   /api/users/:id/send-password    # Send password setup email
GET    /api/users/:id/manager          # Get user's manager
POST   /api/users/:id/manager          # Assign manager
```

### Expense Service
```
GET    /api/expenses                   # Get all expenses (filtered by role)
GET    /api/expenses/:id               # Get expense by ID
POST   /api/expenses                   # Create expense
PUT    /api/expenses/:id               # Update expense
DELETE /api/expenses/:id               # Delete expense (draft only)
POST   /api/expenses/:id/submit        # Submit for approval
GET    /api/expenses/:id/history       # Get approval history
POST   /api/expenses/upload-receipt    # Upload receipt to Cloudinary
GET    /api/categories                 # Get expense categories
POST   /api/categories                 # Create category (Admin)
```

### Approval Service
```
GET    /api/approval-rules             # Get all approval rules
GET    /api/approval-rules/:id         # Get rule by ID
POST   /api/approval-rules             # Create approval rule (Admin)
PUT    /api/approval-rules/:id         # Update approval rule
DELETE /api/approval-rules/:id         # Delete approval rule
GET    /api/approvals/pending          # Get pending approvals for user
POST   /api/approvals/:id/approve      # Approve expense
POST   /api/approvals/:id/reject       # Reject expense
GET    /api/approvals/:expenseId       # Get approval details
```

### Currency Service
```
GET    /api/currency/countries         # Get all countries with currencies
GET    /api/currency/rates             # Get all exchange rates
POST   /api/currency/convert           # Convert amount between currencies
GET    /api/currency/rates/:base       # Get rates for base currency
```

### OCR Service
```
POST   /api/ocr/process                # Process receipt image
GET    /api/ocr/result/:expenseId      # Get OCR result
```

### Notification Service
```
GET    /api/notifications              # Get user notifications
GET    /api/notifications/unread       # Get unread count
PATCH  /api/notifications/:id/read     # Mark as read
DELETE /api/notifications/:id          # Delete notification
```

---

## Environment Variables

### Client (.env)
```env
VITE_API_GATEWAY_URL=http://localhost:5000
VITE_APP_NAME=Expense Management
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
```

### API Gateway (.env)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=24h

# Service URLs
AUTH_SERVICE_URL=http://localhost:5001
USER_SERVICE_URL=http://localhost:5002
EXPENSE_SERVICE_URL=http://localhost:5003
APPROVAL_SERVICE_URL=http://localhost:5004
CURRENCY_SERVICE_URL=http://localhost:5005
OCR_SERVICE_URL=http://localhost:5006
NOTIFICATION_SERVICE_URL=http://localhost:5007
```

### Auth Service (.env)
```env
PORT=5001
NODE_ENV=development

# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=expense_auth
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=24h

# Email (Nodemailer)
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Other Services (.env)
```env
# Similar pattern for each service
PORT=50XX
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=expense_xxx
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password

# MongoDB (for services using it)
MONGODB_URI=mongodb://localhost:27017/expense_xxx

# External APIs
EXCHANGE_RATE_API=https://api.exchangerate-api.com/v4/latest
COUNTRIES_API=https://restcountries.com/v3.1/all

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### OCR Service (.env)
```env
PORT=5006
FLASK_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/expense_ocr

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Implementation Steps

### Phase 1: Setup & Infrastructure
1. Initialize mono-repo with workspaces
2. Setup PostgreSQL database and run migrations
3. Setup MongoDB and create collections with indexes
4. Configure Cloudinary account and folder structure
5. Setup pg-boss for message queue
6. Create shared types folder with all TypeScript interfaces

### Phase 2: Backend Services
1. **API Gateway**
   - Setup Express server with TypeScript
   - Configure routes and proxy middleware
   - Add authentication middleware (JWT verification)
   - Add rate limiting and CORS

2. **Auth Service**
   - Implement signup (company + admin creation)
   - Implement signin (JWT generation)
   - Implement forgot/reset password with email
   - Fetch countries from REST Countries API

3. **User Service**
   - CRUD operations for users
   - Manager-employee relationship management
   - Send password setup emails

4. **Expense Service**
   - CRUD for expenses
   - Receipt upload to Cloudinary
   - Trigger OCR processing via queue
   - Category management

5. **Approval Service**
   - Approval rules CRUD
   - Approval workflow execution
   - Sequential/percentage/hybrid logic
   - Approve/reject actions

6. **Currency Service**
   - Fetch and cache exchange rates
   - Currency conversion logic
   - Cron job for daily rate updates

7. **OCR Service (Python)**
   - Flask API setup
   - Tesseract/EasyOCR integration
   - Receipt parsing logic
   - Store results in MongoDB

8. **Notification Service**
   - Email sending via Nodemailer
   - HTML email templates
   - In-app notification storage
   - Queue workers for async sending

9. **Queue Service**
   - Setup pg-boss workers
   - OCR processing worker
   - Email sending worker
   - Approval notification worker

### Phase 3: Frontend Development
1. **Setup React App**
   - Vite + TypeScript + Tailwind
   - Configure custom Tailwind theme
   - Setup folder structure
   - Install dependencies (framer-motion, react-hook-form, zod, axios, etc.)

2. **Authentication Pages**
   - Signup form with searchable country dropdown
   - Signin form
   - Forgot password form
   - Reset password form
   - Auth context and protected routes

3. **Dashboard Layout**
   - Header with user menu and notifications
   - Sidebar with role-based navigation
   - Main content area
   - Responsive design

4. **User Management (Admin)**
   - Users table with filters
   - Create/edit user modal
   - Assign manager functionality
   - Send password email button

5. **Expense Management (Employee)**
   - Expense list with status filters
   - Create expense form with receipt upload
   - OCR-powered auto-fill
   - Status timeline component
   - Expense history view

6. **Approval Management (Admin)**
   - Approval rules configuration form
   - Sequential approver management
   - Percentage/specific approver options
   - Manager toggle

7. **Pending Approvals (Manager)**
   - Approval queue table
   - Approve/reject modal with comments
   - Currency conversion display
   - Real-time updates after action

8. **Notifications**
   - Notification dropdown in header
   - Unread badge count
   - Mark as read functionality
   - Toast notifications for actions

### Phase 4: Integration & Testing
1. Connect frontend to backend APIs
2. Test all user flows end-to-end
3. Test approval workflows (sequential, percentage, hybrid)
4. Test OCR accuracy and auto-fill
5. Test currency conversions
6. Test email sending
7. Handle error cases and edge cases

### Phase 5: Polish & Optimization
1. Add loading states and skeletons
2. Optimize API calls with caching
3. Add pagination for large lists
4. Improve error messages
5. Add form validation feedback
6. Optimize images and assets
7. Test responsive design on all devices

---

## Key Implementation Notes

### Searchable Country Dropdown
```typescript
// Fetch countries on component mount
const [countries, setCountries] = useState([]);
const [searchTerm, setSearchTerm] = useState('');

useEffect(() => {
  fetch('https://restcountries.com/v3.1/all?fields=name,currencies')
    .then(res => res.json())
    .then(data => {
      const formatted = data.map(country => ({
        name: country.name.common,
        currency: Object.keys(country.currencies)[0],
        currencyName: Object.values(country.currencies)[0].name
      }));
      setCountries(formatted);
    });
}, []);

// Filter countries based on search
const filteredCountries = countries.filter(c =>
  c.name.toLowerCase().includes(searchTerm.toLowerCase())
);

// Implement virtual scrolling for large list (react-window)
```

### OCR Processing with Queue
```typescript
// In Expense Service (after receipt upload)
await queueService.publishJob('ocr-process', {
  expenseId,
  receiptUrl,
  companyId,
  userId
});

// In OCR Worker
async function processOCR(job) {
  const { expenseId, receiptUrl } = job.data;
  
  // Download image from Cloudinary
  const image = await downloadImage(receiptUrl);
  
  // Process with OCR
  const result = await ocrService.extractText(image);
  
  // Parse receipt data
  const parsed = await receiptParser.parse(result.text);
  
  // Store in MongoDB
  await ocrResultModel.create({
    expense_id: expenseId,
    extracted_data: parsed,
    confidence_scores: result.confidence,
    raw_text: result.text
  });
  
  // Update expense with extracted data
  await expenseService.updateFromOCR(expenseId, parsed);
}
```

### Approval Workflow Logic
```typescript
async function handleApprove(approvalActionId, approverId, comments) {
  // Update approval action
  await approvalActionModel.update(approvalActionId, {
    action: 'approved',
    action_date: new Date(),
    comments
  });
  
  // Get approval instance
  const approval = await expenseApprovalModel.findById(approvalActionId);
  const rule = await approvalRuleModel.findById(approval.approval_rule_id);
  
  // Check rule type
  if (rule.rule_type === 'sequential') {
    // Move to next step
    if (approval.current_step < approval.total_steps) {
      await expenseApprovalModel.update(approval.id, {
        current_step: approval.current_step + 1
      });
      // Notify next approver
      await notifyNextApprover(approval);
    } else {
      // All steps complete
      await markExpenseApproved(approval.expense_id);
    }
  } else if (rule.rule_type === 'percentage') {
    // Calculate approval percentage
    const totalActions = await approvalActionModel.countByApproval(approval.id);
    const approvedActions = await approvalActionModel.countApproved(approval.id);
    const percentage = (approvedActions / totalActions) * 100;
    
    if (percentage >= rule.percentage_required) {
      await markExpenseApproved(approval.expense_id);
    }
  } else if (rule.rule_type === 'specific_approver') {
    // Check if approver has auto-approve permission
    const step = await approvalStepModel.findByApprover(approverId);
    if (step.is_auto_approve) {
      await markExpenseApproved(approval.expense_id);
    }
  } else if (rule.rule_type === 'hybrid') {
    // Check both conditions
    // ... implement hybrid logic
  }
}
```

### Currency Conversion
```typescript
async function convertCurrency(amount, fromCurrency, toCurrency, date = new Date()) {
  // Check Redis cache
  const cacheKey = `currency:${fromCurrency}:${toCurrency}:${date.toISOString().split('T')[0]}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return {
      converted_amount: amount * parseFloat(cached),
      exchange_rate: parseFloat(cached)
    };
  }
  
  // Query database
  const rate = await exchangeRateModel.findByDate(fromCurrency, toCurrency, date);
  
  if (rate) {
    // Cache for 24 hours
    await redis.setex(cacheKey, 86400, rate.rate.toString());
    return {
      converted_amount: amount * rate.rate,
      exchange_rate: rate.rate
    };
  }
  
  // Fetch from external API if not in cache or database
  // Store the fetched rate in database
  // Cache the rate in Redis with 24-hour expiry
  // Calculate converted amount using the rate
  // Return both converted amount and exchange rate used
}
```

---

## Message Queue with pg-boss (PostgreSQL-based)

### Queue Setup
- Use pg-boss library which creates job tables in PostgreSQL
- Configure with separate schema called 'pgboss' to keep queue tables isolated
- Setup error handling and logging for queue operations
- Implement start and stop functions for graceful shutdown

### Job Types Definition
Define enum for all job types including:
- OCR_PROCESS: For processing receipt images
- SEND_EMAIL: For sending emails asynchronously
- APPROVAL_NOTIFICATION: For notifying approvers
- CURRENCY_SYNC: For daily currency rate updates

Create TypeScript interfaces for each job's payload structure with all required fields

### Publishing Jobs
- When expense service uploads receipt, publish OCR_PROCESS job to queue
- Include retry configuration (3 retries, 1 minute delay between retries)
- Set expiration time (1 hour) after which job should be discarded
- Pass all necessary data in job payload (expenseId, receiptUrl, companyId, userId)

### Worker Implementation
Create separate worker functions for each job type:

**OCR Worker:**
- Listen for OCR_PROCESS jobs with configurable team size and concurrency
- Download receipt image from Cloudinary URL
- Call Python OCR service to extract text
- Parse extracted text to identify vendor, date, amount, items
- Store OCR results in MongoDB
- Update expense record with extracted data
- Handle errors and retry failed jobs

**Email Worker:**
- Listen for SEND_EMAIL jobs
- Load HTML template based on template name
- Replace template variables with provided data
- Send email using Nodemailer with Gmail SMTP
- Log success/failure
- Store notification record in MongoDB
- Retry on failure

**Approval Notification Worker:**
- Listen for APPROVAL_NOTIFICATION jobs
- Determine notification type (pending, approved, rejected)
- Create notification record in MongoDB
- Send email to relevant users
- Update notification delivery status

---

## Currency Conversion Detailed Flow

### Daily Rate Sync Job
- Cron job runs at 00:00 UTC every day
- Fetch latest rates from exchangerate-api for company's base currency
- Store all rates in exchange_rates table with effective date
- Update Redis cache for commonly used currency pairs
- Log sync status and any errors

### Real-time Conversion
When expense is submitted in different currency:
1. Check if conversion rate exists in Redis cache (key format: currency:FROM:TO:DATE)
2. If cache miss, query exchange_rates table for that date
3. If database miss, call external API to get current rate
4. Store fetched rate in both database and Redis cache
5. Calculate converted amount by multiplying original amount with rate
6. Store both original amount/currency and converted amount/rate in expense record
7. Display converted amount to approvers in company currency

### Rate History
- Keep historical rates in database for audit trail
- Allow viewing expense with rate used at submission time
- Prevent rate changes from affecting already submitted expenses
- Generate reports showing currency-wise expense breakdown

---

## Approval Workflow Detailed Logic

### Rule Matching Algorithm
When expense is submitted:
1. Find all active approval rules for the company
2. Filter rules matching expense criteria:
   - Check if expense category matches rule's category (if specified)
   - Check if expense amount is within rule's min/max threshold
   - Apply rule priority (higher priority rules take precedence)
3. Select the most specific matching rule
4. If no rule matches, use default company-wide rule

### Sequential Approval Flow
- Create approval chain based on rule's configured steps
- If is_manager_approver is true, insert employee's manager as Step 1
- Add all configured approvers as subsequent steps in order
- Create approval_actions records for all steps with status 'pending'
- Notify first approver via email and in-app notification
- When approver approves:
  - Update their approval_action to 'approved' with timestamp and comments
  - Check if more steps remain
  - If yes, notify next approver in sequence
  - If no more steps, mark expense as fully approved
  - Send approval notification to employee
  - Remove from all pending approval queues

### Percentage-Based Approval Flow
- Calculate total number of approvers in the rule
- Track how many have approved in real-time
- After each approval, calculate percentage: (approved_count / total_count) × 100
- If percentage meets or exceeds required threshold:
  - Mark expense as approved immediately
  - Skip remaining pending approvals
  - Notify employee of approval
  - Cancel pending notifications to remaining approvers
- If percentage cannot reach threshold (too many rejections), mark as rejected

### Specific Approver Auto-Approve
- Mark certain approvers (like CFO, CEO) with is_auto_approve flag
- When expense reaches these approvers:
  - If they approve, automatically mark entire expense as approved
  - Skip all remaining steps in sequence
  - Notify employee immediately
- This gives senior stakeholders override power

### Hybrid Rule Flow
- Combine sequential with percentage OR specific approver logic
- Example: "Expense approved if 60% approve OR CFO approves"
- Check both conditions after each approval action:
  - Calculate if percentage threshold met
  - Check if any auto-approve user has approved
  - If either condition is true, approve expense
- Allows flexible approval paths for different scenarios

### Rejection Handling
- Single rejection can stop entire approval flow (configurable)
- Or require majority rejection to reject expense (based on rule)
- When rejected:
  - Mark expense_approvals status as 'rejected'
  - Update expense status to 'rejected'
  - Capture rejection reason in comments
  - Notify employee with reason
  - Remove from all pending queues
  - Create audit log entry

---

## OCR Service Implementation Details

### Python Service Architecture
- Flask API with REST endpoints
- Use Tesseract OCR or EasyOCR for text extraction
- Implement receipt parsing logic to structure extracted text
- Store results in MongoDB for querying and analysis

### Image Preprocessing
Before OCR processing:
- Download image from Cloudinary URL
- Resize image to optimal dimensions (improves accuracy)
- Convert to grayscale
- Apply image enhancement (contrast, brightness adjustment)
- Detect and correct image rotation/skew
- Remove noise and blur

### Text Extraction
- Run OCR engine on preprocessed image
- Extract all text with confidence scores
- Identify text regions and their positions
- Handle multiple languages if needed
- Return raw text and structured data

### Receipt Parsing Logic
Analyze extracted text to identify:
- **Vendor name**: Usually at top, largest text, may include keywords like "Restaurant", "Hotel", "Store"
- **Date**: Look for date patterns (DD/MM/YYYY, MM-DD-YYYY, etc.)
- **Total amount**: Search for keywords like "Total", "Amount", "Grand Total" followed by number
- **Currency**: Identify currency symbols ($, €, ₹, £) or codes (USD, EUR, INR)
- **Tax/GST**: Find "Tax", "GST", "VAT" with associated amount
- **Line items**: Extract itemized list with descriptions and prices
- **Payment method**: Look for "Cash", "Card", "Credit Card", "UPI"
- **Receipt number**: Search for "Receipt #", "Invoice #", "Bill #"

### Confidence Scoring
- Calculate overall confidence based on how many fields were successfully extracted
- Individual confidence scores for each field
- If confidence is low (< 50%), flag for manual review
- Store confidence scores for analytics and improvement

### Error Handling
- If image quality is too poor, return error with message
- If no text detected, return empty result with low confidence
- Handle different receipt formats (thermal, printed, handwritten)
- Fallback to simpler extraction if complex parsing fails

### Result Storage
- Store complete OCR results in MongoDB for audit and debugging
- Include raw text, parsed data, confidence scores, processing time
- Link to expense record via expenseId
- Allow reprocessing if needed

---

## Email Service and Templates

### Nodemailer Configuration
- Use Gmail SMTP service with app password (not regular password)
- Configure sender name and email
- Setup connection pooling for better performance
- Implement retry logic for failed sends
- Track delivery status

### Email Template System
Create HTML templates for all notification types:

**Welcome Email:**
- Sent when new company/admin signs up
- Include company name, admin name
- Provide quick start guide links
- Encourage completing profile setup

**Password Reset Email:**
- Sent when user requests password reset
- Include secure reset link with token (expires in 1 hour)
- Clear instructions on how to reset
- Warning about not sharing link

**New User Password Setup:**
- Sent when admin creates new employee/manager
- Include temporary login link or credentials
- Instructions to set permanent password
- Welcome message

**Expense Submitted:**
- Sent to first approver when expense submitted
- Include expense details (description, amount, date)
- Link to approve/reject in application
- Show employee name and receipt thumbnail

**Approval Pending Reminder:**
- Sent if approval pending for more than 3 days
- List of pending expenses
- One-click approve/reject links
- Urgency indicator

**Expense Approved:**
- Sent to employee when expense fully approved
- Show approval path (who approved and when)
- Estimated reimbursement timeline
- Thank you message

**Expense Rejected:**
- Sent to employee when expense rejected
- Clear rejection reason from approver comments
- Guidance on how to resubmit if applicable
- Contact information for queries

### Template Variables
Each template supports dynamic variables:
- User names (firstName, lastName)
- Company name
- Expense details (amount, category, date)
- Approver information
- Action links with tokens
- Timestamps

### Email Styling
- Responsive HTML that works on all email clients
- Use inline CSS (many clients strip external styles)
- Include company branding (logo, colors)
- Clear call-to-action buttons
- Mobile-friendly layout
- Plain text fallback for accessibility

---

## Frontend UI Components and Patterns

### Custom Design System
Create unique visual language that doesn't look like standard component libraries:

**Color Usage:**
- Primary color for main actions and highlights
- Secondary color for supporting elements
- Neutral grays for text and borders
- Success green for approvals and positive states
- Warning orange for pending/review states
- Error red for rejections and errors
- Use gradient combinations for headers and cards to add depth

**Typography Hierarchy:**
- Display font (Poppins) for headings and important text
- Sans-serif font (Inter) for body text and UI elements
- Clear size scale with proper line heights
- Appropriate font weights (400 regular, 500 medium, 600 semibold, 700 bold)

**Card Design:**
- Rounded corners (12px) for modern feel
- Subtle shadows that increase on hover
- Border with light neutral color
- Proper padding and internal spacing
- Hover state with slight scale-up animation

**Button Styles:**
- Primary: Solid background with white text
- Secondary: Outlined with colored text
- Ghost: No background, colored text, hover shows background
- Consistent height (40px for medium, 48px for large)
- Smooth transitions on hover and click
- Loading states with spinner
- Disabled states with reduced opacity

**Form Inputs:**
- Clear labels above inputs
- Placeholder text for guidance
- Focus state with colored border and subtle glow
- Error state with red border and error message below
- Success state with green checkmark
- Proper spacing between fields

**Tables:**
- Clean layout with borders between rows
- Hover state highlights entire row
- Sortable column headers with icons
- Action buttons in last column
- Responsive design that collapses to cards on mobile
- Pagination or infinite scroll for large datasets

**Modals:**
- Backdrop with blur effect
- Card-style content area
- Clear header with title and close button
- Content area with proper scrolling
- Footer with action buttons (right-aligned)
- Smooth entrance/exit animations

### Animation Guidelines
Use Framer Motion but make animations subtle and professional:

**Page Transitions:**
- Fade in with slight upward movement (10-20px)
- Duration: 300-400ms
- Easing: easeOut for natural feel

**List Items:**
- Stagger animation when rendering lists
- Each item fades in with 50ms delay from previous
- Subtle slide in from left

**Modals:**
- Scale from 0.95 to 1.0 while fading in
- Backdrop fades in simultaneously
- Exit animations reverse the entrance

**Hover Effects:**
- Scale up cards by 2% (1.02)
- Increase shadow elevation
- Duration: 200ms
- Use transform for better performance

**Loading States:**
- Skeleton screens instead of spinners when possible
- Pulse animation for loading placeholders
- Smooth transition when content loads

**Status Changes:**
- Color transition when status updates
- Icon scale animation to draw attention
- Brief highlight flash to indicate change

### Avoid These Animation Patterns
- No bounce effects (looks childish)
- No spinning/rotating elements (except loading spinners)
- No slide-in from screen edges (dated)
- No 3D transforms or flips
- No confetti or celebration animations
- Keep all animations under 500ms

---

## Responsive Design Strategy

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px
- Wide desktop: > 1440px

### Mobile-First Approach
Design for mobile first, then enhance for larger screens:

**Navigation:**
- Mobile: Bottom tab bar or hamburger menu
- Desktop: Side navigation sidebar

**Tables:**
- Mobile: Convert to card layout
- Each row becomes a card with vertical field layout
- Important fields shown prominently
- Actions in card footer

**Forms:**
- Mobile: Full-width inputs, vertical layout
- Desktop: Multi-column layout where appropriate
- Proper touch targets (min 44x44px)

**Modals:**
- Mobile: Full-screen overlay
- Desktop: Centered modal with backdrop

**Dashboard:**
- Mobile: Single column, stacked cards
- Tablet: 2-column grid
- Desktop: 3-4 column grid with more data density

---

## Security Best Practices

### Authentication
- Store JWT tokens in httpOnly cookies (not localStorage for production)
- Include CSRF tokens for state-changing operations
- Implement token refresh mechanism
- Set reasonable token expiry (24 hours)
- Hash passwords with bcrypt (10 rounds minimum)

### Authorization
- Verify user role on every protected endpoint
- Check company_id matches for all data access
- Implement row-level security where possible
- Don't trust client-side role checks

### Input Validation
- Validate all inputs on server side
- Use Zod or similar for schema validation
- Sanitize inputs to prevent SQL injection
- Limit file upload sizes and types
- Validate email formats, dates, amounts

### File Upload Security
- Validate file types (only images for receipts)
- Scan for malware if possible
- Use Cloudinary's built-in security features
- Generate unique filenames to prevent overwrites
- Set proper access controls on uploaded files

### API Security
- Rate limiting on all endpoints
- CORS configuration for frontend domain only
- Request size limits
- Logging of all authentication attempts
- Monitor for suspicious patterns

---

## Testing Strategy

### Unit Tests
- Test all service functions in isolation
- Mock database calls
- Test error handling and edge cases
- Aim for 70%+ code coverage

### Integration Tests
- Test API endpoints with real database
- Test approval workflow end-to-end
- Test OCR processing pipeline
- Test email sending idx_companies_country ON companies(country);
```

#### 2. Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'manager', 'employee')),
    is_active BOOLEAN DEFAULT true,
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### 3. Manager Relationships Table
```sql
CREATE TABLE manager_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    manager_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT true,
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_to DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, manager_id, effective_from)
);

CREATE INDEX idx_manager_rel_employee ON manager_relationships(employee_id);
CREATE INDEX idx_manager_rel_manager ON manager_relationships(manager_id);
```

#### 4. Expense Categories Table
```sql
CREATE TABLE expense_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, name)
);

CREATE INDEX idx_categories_company ON expense_categories(company_id);
```

#### 5. Expenses Table
```sql
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES expense_categories(id),
    
    -- Expense Details
    description TEXT NOT NULL,
    expense_date DATE NOT NULL,
    
    -- Amount Information
    amount DECIMAL(15, 2) NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    converted_amount DECIMAL(15, 2),
    exchange_rate DECIMAL(10, 6),
    
    -- Payment Info
    paid_by VARCHAR(50),
    gst_percentage DECIMAL(5, 2) DEFAULT 0,
    
    -- Receipt Information
    receipt_url VARCHAR(500),
    receipt_public_id VARCHAR(255),
    ocr_processed BOOLEAN DEFAULT false,
    ocr_confidence DECIMAL(5, 2),
    
    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'draft' 
        CHECK (status IN ('draft', 'submitted', 'pending_approval', 'approved', 'rejected', 'paid')),
    submitted_at TIMESTAMP,
    
    -- Metadata
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_expenses_employee ON expenses(employee_id);
CREATE INDEX idx_expenses_company ON expenses(company_id);
CREATE INDEX idx_expenses_status ON expenses(status);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_expenses_category ON expenses(category_id);
```

#### 6. Expense Line Items Table
```sql
CREATE TABLE expense_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    quantity DECIMAL(10, 2) DEFAULT 1,
    unit_price DECIMAL(15, 2),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_line_items_expense ON expense_line_items(expense_id);
```

#### 7. Approval Rules Table
```sql
CREATE TABLE approval_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Rule Type
    rule_type VARCHAR(50) NOT NULL 
        CHECK (rule_type IN ('sequential', 'percentage', 'specific_approver', 'hybrid')),
    
    -- Thresholds
    min_amount DECIMAL(15, 2),
    max_amount DECIMAL(15, 2),
    
    -- Conditions
    is_manager_approver BOOLEAN DEFAULT true,
    percentage_required DECIMAL(5, 2),
    
    -- Category specific
    category_id UUID REFERENCES expense_categories(id),
    
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_approval_rules_company ON approval_rules(company_id);
CREATE INDEX idx_approval_rules_active ON approval_rules(is_active);
CREATE INDEX idx_approval_rules_category ON approval_rules(category_id);
```

#### 8. Approval Steps Table
```sql
CREATE TABLE approval_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    approval_rule_id UUID NOT NULL REFERENCES approval_rules(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    approver_role VARCHAR(50),
    approver_id UUID REFERENCES users(id),
    is_auto_approve BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(approval_rule_id, step_number)
);

CREATE INDEX idx_approval_steps_rule ON approval_steps(approval_rule_id);
```

#### 9. Expense Approvals Table
```sql
CREATE TABLE expense_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
    approval_rule_id UUID REFERENCES approval_rules(id),
    
    -- Current State
    current_step INTEGER DEFAULT 1,
    total_steps INTEGER NOT NULL,
    
    status VARCHAR(50) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'in_progress', 'approved', 'rejected', 'escalated')),
    
    -- Timestamps
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_expense_approvals_expense ON expense_approvals(expense_id);
CREATE INDEX idx_expense_approvals_status ON expense_approvals(status);
```

#### 10. Approval Actions Table
```sql
CREATE TABLE approval_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_approval_id UUID NOT NULL REFERENCES expense_approvals(id) ON DELETE CASCADE,
    expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
    
    -- Approver Info
    approver_id UUID NOT NULL REFERENCES users(id),
    step_number INTEGER NOT NULL,
    
    -- Action
    action VARCHAR(50) NOT NULL CHECK (action IN ('approved', 'rejected', 'pending')),
    comments TEXT,
    
    -- Timestamps
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX