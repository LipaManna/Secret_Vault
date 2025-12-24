const deriveKeyFromPassword = async (password, salt) => {
    const encoder = new TextEncoder();
    const passwordKey = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey'],
    )
    return await window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256',
        },
        passwordKey,
        {
            name: 'AES-GCM',
            length: 256,
        },
        false,
        ['encrypt', 'decrypt'],
    )
}

const generateSalt = () => {
    return window.crypto.getRandomValues(new Uint8Array(16));
}

export const encrypt = async (password) => {
    if(!password){
        throw new Error('Password is required');
    }
    try{
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const salt = generateSalt();
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const key = await deriveKeyFromPassword(password, salt);
        const encryptedData = await window.crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv: iv,
            },
            key,
            data
        )
        const combinedData = new Uint8Array(salt.length + iv.length + encryptedData.byteLength);
        combinedData.set(salt,0);
        combinedData.set(iv, salt.length);
        combinedData.set(new Uint8Array(encryptedData), salt.length + iv.length);
        return btoa(String.fromCharCode(...combinedData));
    }
    catch(error){
        throw new Error('Failed to encrypt password');
    }
}

export const decrypt = async (encryptedPassword) => {
    if(!encryptedPassword){
        throw new Error('Encrypted password is required');
    }
    try{
        const combinedData = Uint8Array.from(atob(encryptedPassword),c => c.charCodeAt(0));
        const salt = combinedData.slice(0,16);
        const iv = combinedData.slice(16,28);
        const encryptedData = combinedData.slice(28);

        const key = await deriveKeyFromPassword(encryptedPassword, salt);
        const decryptedData = await window.crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: iv,
            },
            key,
            encryptedData
        )
        const decoder = new TextDecoder();
        return decoder.decode(decryptedData);
    }
    catch(error){
        throw new Error('Failed to decrypt password');
    }
}

// Encrypt data using a master password
export const encryptData = async (data, masterPassword) => {
    if (!data || !masterPassword) {
        throw new Error('Data and master password are required');
    }
    try {
        const encoder = new TextEncoder();
        const dataString = typeof data === 'string' ? data : JSON.stringify(data);
        const dataBytes = encoder.encode(dataString);
        const salt = generateSalt();
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const key = await deriveKeyFromPassword(masterPassword, salt);
        const encryptedData = await window.crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv: iv,
            },
            key,
            dataBytes
        );
        const combinedData = new Uint8Array(salt.length + iv.length + encryptedData.byteLength);
        combinedData.set(salt, 0);
        combinedData.set(iv, salt.length);
        combinedData.set(new Uint8Array(encryptedData), salt.length + iv.length);
        return btoa(String.fromCharCode(...combinedData));
    } catch (error) {
        throw new Error(`Failed to encrypt data: ${error.message}`);
    }
};

// Decrypt data using a master password
export const decryptData = async (encryptedData, masterPassword) => {
    if (!encryptedData || !masterPassword) {
        throw new Error('Encrypted data and master password are required');
    }
    try {
        const combinedData = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
        const salt = combinedData.slice(0, 16);
        const iv = combinedData.slice(16, 28);
        const encryptedBytes = combinedData.slice(28);
        const key = await deriveKeyFromPassword(masterPassword, salt);
        const decryptedData = await window.crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: iv,
            },
            key,
            encryptedBytes
        );
        const decoder = new TextDecoder();
        return decoder.decode(decryptedData);
    } catch (error) {
        throw new Error(`Failed to decrypt data: ${error.message}`);
    }
};