import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { saveToken } from '../utils/tokenHandler.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req, res) => {
    try { 
        const { email, password, role, fullName, departmentId, qualification } = req.body;
 
        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        const passwordHash = await bcrypt.hash(password, 10);

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email,
                    passwordHash,
                    role,
                },
            });

            const staffProfile = await tx.staffProfile.create({
                data: {
                    id: user.id,
                    fullName,
                    departmentId,
                    qualification
                },
            });

            return { user, staffProfile };
        });

        res.status(201).json({ message: 'User registered successfully', data: result });
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ error: 'Internal server error. This is my error' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
            include: { staffProfile: true }
        });

        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            { userId: user.id, role: user.role, staffId: user.staffProfile?.id },
            JWT_SECRET,
            { expiresIn: '12h' }
        );

        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });

        saveToken(token, res);

        res.json({
            role: user.role,
            staffId: user.staffProfile?.id,
            fullName: user.staffProfile?.fullName
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
