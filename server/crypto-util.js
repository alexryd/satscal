import crypto from 'crypto'

const MASTER_KEY = 'testing123'

const CryptoUtil = {
  encrypt: (userId, password) => {
    try {
      const text = `${userId}:${password}`

      const salt = crypto.randomBytes(12)
      const iv = crypto.randomBytes(12)
      const key = CryptoUtil.getKey(salt)

      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
      const encrypted = Buffer.concat([
        cipher.update(text, 'utf8'),
        cipher.final()
      ])
      const tag = cipher.getAuthTag()

      return Buffer.concat([
        salt,
        iv,
        tag,
        encrypted
      ]).toString('base64')
    } catch (e) {
      console.error('Error encrypting username and password:', e)
    }

    return null
  },

  decrypt: (data) => {
    try {
      const bData = new Buffer(data, 'base64')

      const salt = bData.slice(0, 12)
      const iv = bData.slice(12, 24)
      const tag = bData.slice(24, 40)
      const text = bData.slice(40)
      const key = CryptoUtil.getKey(salt)

      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
      decipher.setAuthTag(tag)

      const decrypted = decipher.update(text, 'binary', 'utf8') + decipher.final('utf8')
      const i = decrypted.indexOf(':')

      return {
        userId: decrypted.slice(0, i),
        password: decrypted.slice(i + 1)
      }
    } catch (e) {
      console.error('Error decrypting username and password:', e)
    }

    return null
  },

  getKey: (salt) => {
    return crypto.pbkdf2Sync(MASTER_KEY, salt, 2145, 32, 'sha512')
  }
}

export default CryptoUtil
