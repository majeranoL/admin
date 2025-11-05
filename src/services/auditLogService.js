import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'

/**
 * Audit Log Service
 * Automatically logs all critical system actions to Firestore
 */

export const AuditLogService = {
  /**
   * Log an audit entry
   * @param {Object} logData - The audit log data
   */
  async createLog({
    type,           // 'Authentication', 'User Management', 'Data Access', 'System', 'Security'
    action,         // Description of the action
    severity,       // 'Info', 'Warning', 'Error', 'Critical'
    user,           // User ID who performed the action
    userEmail,      // User email
    userRole,       // User role (admin, superadmin, shelter, rescuer, user)
    details,        // Detailed description
    metadata = {},  // Additional data (JSON object)
    ipAddress = 'Unknown',
    userAgent = 'Unknown'
  }) {
    try {
      const logEntry = {
        type,
        action,
        severity,
        user,
        userEmail: userEmail || 'Unknown',
        userRole: userRole || 'Unknown',
        details,
        metadata,
        ipAddress,
        userAgent,
        timestamp: new Date().toISOString(),
        createdAt: serverTimestamp()
      }

      const docRef = await addDoc(collection(db, 'auditLogs'), logEntry)
      console.log('✅ Audit log created:', docRef.id)
      return docRef.id
    } catch (error) {
      console.error('❌ Failed to create audit log:', error)
      // Don't throw - logging should never break the app
      return null
    }
  },

  // Convenience methods for common log types
  
  async logAuthentication(action, user, userEmail, success = true) {
    return this.createLog({
      type: 'Authentication',
      action,
      severity: success ? 'Info' : 'Warning',
      user,
      userEmail,
      userRole: 'Unknown',
      details: success ? `User ${action.toLowerCase()} successfully` : `Failed ${action.toLowerCase()} attempt`,
      metadata: { success }
    })
  },

  async logUserManagement(action, adminUser, adminEmail, adminRole, targetUser, targetEmail) {
    return this.createLog({
      type: 'User Management',
      action,
      severity: 'Info',
      user: adminUser,
      userEmail: adminEmail,
      userRole: adminRole,
      details: `${action} for user: ${targetEmail}`,
      metadata: { targetUser, targetEmail }
    })
  },

  async logDataAccess(action, user, userEmail, userRole, resource) {
    return this.createLog({
      type: 'Data Access',
      action,
      severity: 'Info',
      user,
      userEmail,
      userRole,
      details: `Accessed ${resource}`,
      metadata: { resource }
    })
  },

  async logSystemEvent(action, details, severity = 'Info') {
    return this.createLog({
      type: 'System',
      action,
      severity,
      user: 'System',
      userEmail: 'system@animal911.com',
      userRole: 'system',
      details,
      metadata: {}
    })
  },

  async logSecurityEvent(action, details, severity = 'Warning') {
    return this.createLog({
      type: 'Security',
      action,
      severity,
      user: 'Security System',
      userEmail: 'security@animal911.com',
      userRole: 'system',
      details,
      metadata: {}
    })
  },

  async logShelterAction(action, adminUser, adminEmail, shelterName, shelterId, details) {
    return this.createLog({
      type: 'User Management',
      action,
      severity: 'Info',
      user: adminUser,
      userEmail: adminEmail,
      userRole: 'superadmin',
      details: `${action} for shelter: ${shelterName}`,
      metadata: { shelterId, shelterName, details }
    })
  },

  async logRescueOperation(action, user, userEmail, userRole, rescueId, details) {
    return this.createLog({
      type: 'Data Access',
      action,
      severity: 'Info',
      user,
      userEmail,
      userRole,
      details: `${action} - ${details}`,
      metadata: { rescueId }
    })
  },

  async logAdoptionAction(action, user, userEmail, userRole, adoptionId, details) {
    return this.createLog({
      type: 'Data Access',
      action,
      severity: 'Info',
      user,
      userEmail,
      userRole,
      details: `${action} - ${details}`,
      metadata: { adoptionId }
    })
  }
}

export default AuditLogService
