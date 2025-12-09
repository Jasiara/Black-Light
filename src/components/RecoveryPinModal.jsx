import { useState } from 'react';
import './RecoveryPinModal.css';

/**
 * Recovery PIN Modal Component
 * 
 * NOTE: This is a placeholder implementation until email integration is added.
 * In production, the recovery PIN should be sent to the user's email address
 * instead of being displayed in the browser.
 * 
 * Displays a 6-digit recovery PIN to users after registration with instructions
 * to save it for password recovery purposes.
 */
const RecoveryPinModal = ({ pin, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content recovery-pin-modal">
        <div className="modal-header">
          <h2>🔐 Save Your Recovery PIN</h2>
        </div>
        
        <div className="modal-body">
          <div className="pin-display">
            <div className="pin-number">{pin}</div>
          </div>

          <div className="important-notice">
            <h3>📸 IMPORTANT: Take a Photo of This PIN</h3>
            <p>
              This 6-digit PIN is your only way to recover your account if you forget your password.
            </p>
            <ul>
              <li>✓ Save this PIN in a secure location</li>
              <li>✓ Take a screenshot or photo</li>
              <li>✓ Write it down and keep it safe</li>
              <li>✗ Do not share it with anyone</li>
            </ul>
          </div>

          <p className="tech-note">
            <strong>Note for Development:</strong> This PIN display is a placeholder 
            until email integration is implemented. In production, this PIN will be sent 
            to your email address instead.
          </p>

          <div className="modal-actions">
            <button onClick={handleCopy} className="copy-btn">
              {copied ? '✓ Copied!' : '📋 Copy PIN'}
            </button>
            <button onClick={onClose} className="close-btn">
              I've Saved My PIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoveryPinModal;
