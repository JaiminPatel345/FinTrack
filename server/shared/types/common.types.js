"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaidByMethod = exports.NotificationType = exports.ApprovalAction = exports.ApprovalRuleType = exports.ExpenseStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["MANAGER"] = "manager";
    UserRole["EMPLOYEE"] = "employee";
})(UserRole || (exports.UserRole = UserRole = {}));
var ExpenseStatus;
(function (ExpenseStatus) {
    ExpenseStatus["DRAFT"] = "draft";
    ExpenseStatus["SUBMITTED"] = "submitted";
    ExpenseStatus["PENDING_APPROVAL"] = "pending_approval";
    ExpenseStatus["APPROVED"] = "approved";
    ExpenseStatus["REJECTED"] = "rejected";
})(ExpenseStatus || (exports.ExpenseStatus = ExpenseStatus = {}));
var ApprovalRuleType;
(function (ApprovalRuleType) {
    ApprovalRuleType["SEQUENTIAL"] = "sequential";
    ApprovalRuleType["PERCENTAGE"] = "percentage";
    ApprovalRuleType["SPECIFIC_APPROVER"] = "specific_approver";
    ApprovalRuleType["HYBRID"] = "hybrid";
})(ApprovalRuleType || (exports.ApprovalRuleType = ApprovalRuleType = {}));
var ApprovalAction;
(function (ApprovalAction) {
    ApprovalAction["PENDING"] = "pending";
    ApprovalAction["APPROVED"] = "approved";
    ApprovalAction["REJECTED"] = "rejected";
})(ApprovalAction || (exports.ApprovalAction = ApprovalAction = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["WELCOME"] = "welcome";
    NotificationType["PASSWORD_RESET"] = "password_reset";
    NotificationType["PASSWORD_SETUP"] = "password_setup";
    NotificationType["EXPENSE_SUBMITTED"] = "expense_submitted";
    NotificationType["APPROVAL_PENDING"] = "approval_pending";
    NotificationType["EXPENSE_APPROVED"] = "expense_approved";
    NotificationType["EXPENSE_REJECTED"] = "expense_rejected";
    NotificationType["APPROVAL_REMINDER"] = "approval_reminder";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var PaidByMethod;
(function (PaidByMethod) {
    PaidByMethod["CASH"] = "cash";
    PaidByMethod["CREDIT_CARD"] = "credit_card";
    PaidByMethod["DEBIT_CARD"] = "debit_card";
    PaidByMethod["COMPANY_CARD"] = "company_card";
    PaidByMethod["UPI"] = "upi";
    PaidByMethod["NET_BANKING"] = "net_banking";
    PaidByMethod["OTHER"] = "other";
})(PaidByMethod || (exports.PaidByMethod = PaidByMethod = {}));
