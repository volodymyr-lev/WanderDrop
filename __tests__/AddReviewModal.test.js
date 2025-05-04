import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import AddReviewModal from '../components/AddReviewModal';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/firebase';

jest.mock('../firebase/firebase', () => ({
    db: {}
}));

jest.mock('firebase/firestore', () => ({
    addDoc: jest.fn(),
    collection: jest.fn()
}));

describe('AddReviewModal', () => {
    const mockPlaceId = 'place123';
    const mockUser = { uid: 'user123', name: 'Test User' };
    const mockOnClose = jest.fn();
    const mockOnReviewAdded = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        addDoc.mockResolvedValue({});
        collection.mockReturnValue({});
    });

    it('should render all required elements when visible', () => {
        const { getByText, getByPlaceholderText } = render(
            <AddReviewModal
                visible={true}
                onClose={mockOnClose}
                placeId={mockPlaceId}
                user={mockUser}
                onReviewAdded={mockOnReviewAdded}
            />
        );

        expect(getByText('Add Review')).toBeTruthy();
        expect(getByPlaceholderText('Your review')).toBeTruthy();
        expect(getByPlaceholderText('Rating (1-5)')).toBeTruthy();
        expect(getByText('Submit')).toBeTruthy();
        expect(getByText('Cancel')).toBeTruthy();
    });

    it('should call onClose when Cancel button is pressed', () => {
        const { getByText } = render(
            <AddReviewModal
                visible={true}
                onClose={mockOnClose}
                placeId={mockPlaceId}
                user={mockUser}
                onReviewAdded={mockOnReviewAdded}
            />
        );

        fireEvent.press(getByText('Cancel'));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not call addDoc when submitted with empty fields', () => {
        const { getByText } = render(
            <AddReviewModal
                visible={true}
                onClose={mockOnClose}
                placeId={mockPlaceId}
                user={mockUser}
                onReviewAdded={mockOnReviewAdded}
            />
        );

        fireEvent.press(getByText('Submit'));
        expect(addDoc).not.toHaveBeenCalled();
        expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should submit review successfully when fields are filled', async () => {
        const mockDate = new Date('2025-05-04');
        const realDate = global.Date;
        global.Date = jest.fn(() => mockDate);
        global.Date.now = realDate.now;
        
        const { getByText, getByPlaceholderText } = render(
            <AddReviewModal
                visible={true}
                onClose={mockOnClose}
                placeId={mockPlaceId}
                user={mockUser}
                onReviewAdded={mockOnReviewAdded}
            />
        );

        fireEvent.changeText(getByPlaceholderText('Your review'), 'Great place!');
        fireEvent.changeText(getByPlaceholderText('Rating (1-5)'), '5');
        
        await act(async () => {
            fireEvent.press(getByText('Submit'));
        });
        
        expect(collection).toHaveBeenCalledWith(db, 'places', mockPlaceId, 'reviews');
        expect(addDoc).toHaveBeenCalled();
        
        const addDocFirstArg = addDoc.mock.calls[0][0];
        expect(addDocFirstArg).toBeDefined();
        
        const reviewObj = addDoc.mock.calls[0][1];
        expect(reviewObj.text).toBe('Great place!');
        expect(reviewObj.rating).toBe(5);
        expect(reviewObj.user_id).toBe(mockUser.uid);
        expect(reviewObj.date).toEqual(mockDate);
        
        expect(mockOnClose).toHaveBeenCalledTimes(1);
        expect(mockOnReviewAdded).toHaveBeenCalledTimes(1);
        
        global.Date = realDate;
    });

    it('should handle errors when adding review fails', async () => {
        const originalConsoleLog = console.log;
        console.log = jest.fn();
        
        addDoc.mockImplementationOnce(() => Promise.reject(new Error('Test error')));

        const { getByText, getByPlaceholderText } = render(
            <AddReviewModal
                visible={true}
                onClose={mockOnClose}
                placeId={mockPlaceId}
                user={mockUser}
                onReviewAdded={mockOnReviewAdded}
            />
        );

        fireEvent.changeText(getByPlaceholderText('Your review'), 'Great place!');
        fireEvent.changeText(getByPlaceholderText('Rating (1-5)'), '5');
        
        await act(async () => {
            fireEvent.press(getByText('Submit'));
        });
        
        expect(addDoc).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(
            "Error adding review:", 
            expect.objectContaining({ message: 'Test error' })
        );
        
        console.log = originalConsoleLog;
    });
});
