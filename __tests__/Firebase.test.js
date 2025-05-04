import {
    getMarkers,
    getReviewsById,
    getUser,
    getPlacesByIds,
    handleRegister,
    getContributesByUser,
    handleSave,
    db,
    auth
} from '../firebase/firebase';
import { EventRegister } from "react-native-event-listeners";
import * as firebaseFirestore from "firebase/firestore";
import * as firebaseAuth from "firebase/auth";

describe('Firebase Service Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        console.error = jest.fn();
    });

    it('getMarkers should return list of markers', async () => {
        const mockMarkers = [
            { id: '1', name: 'Place 1', location: { lat: 50.4501, lng: 30.5234 } },
            { id: '2', name: 'Place 2', location: { lat: 49.8397, lng: 24.0297 } }
        ];

        const mockSnapshot = {
            docs: mockMarkers.map(marker => ({
                id: marker.id,
                data: () => ({ name: marker.name, location: marker.location }),
            })),
        };

        firebaseFirestore.collection.mockReturnValueOnce('places-collection');
        firebaseFirestore.getDocs.mockResolvedValueOnce(mockSnapshot);

        const result = await getMarkers();

        expect(firebaseFirestore.collection).toHaveBeenCalledWith(db, 'places');
        expect(firebaseFirestore.getDocs).toHaveBeenCalledWith('places-collection');
        expect(result).toEqual(mockMarkers);
    });

    it('getMarkers should return empty array on error', async () => {
        const errorMsg = 'Database connection failed';
        firebaseFirestore.collection.mockReturnValueOnce('places-collection');
        firebaseFirestore.getDocs.mockRejectedValueOnce(new Error(errorMsg));

        const result = await getMarkers();

        expect(console.error).toHaveBeenCalled();
        expect(result).toEqual([]);
    });

    it('getReviewsById should return reviews for a place', async () => {
        const placeId = 'place-123';
        const mockReviews = [
            { id: 'rev1', text: 'Great place!', rating: 5 },
            { id: 'rev2', text: 'Nice views', rating: 4 }
        ];

        const mockSnapshot = {
            docs: mockReviews.map(review => ({
                id: review.id,
                data: () => ({ text: review.text, rating: review.rating }),
            })),
        };

        firebaseFirestore.collection.mockReturnValueOnce('reviews-collection');
        firebaseFirestore.getDocs.mockResolvedValueOnce(mockSnapshot);

        const result = await getReviewsById(placeId);

        expect(firebaseFirestore.collection).toHaveBeenCalledWith(db, 'places', placeId, 'reviews');
        expect(firebaseFirestore.getDocs).toHaveBeenCalledWith('reviews-collection');
        expect(result).toEqual(mockReviews);
    });

    it('getReviewsById should return empty array on error', async () => {
        const placeId = 'place-123';
        firebaseFirestore.collection.mockReturnValueOnce('reviews-collection');
        firebaseFirestore.getDocs.mockRejectedValueOnce(new Error('Failed to fetch reviews'));

        const result = await getReviewsById(placeId);

        expect(console.error).toHaveBeenCalled();
        expect(result).toEqual([]);
    });

    it('getUser should return user data for valid ID', async () => {
        const userId = 'user-123';
        const mockUserData = {
            id: userId,
            name: 'John Doe',
            email: 'john@example.com',
            saved: ['place-1', 'place-2'],
        };

        const mockSnapshot = {
            exists: jest.fn().mockReturnValue(true),
            id: userId,
            data: jest.fn().mockReturnValue({
                name: mockUserData.name,
                email: mockUserData.email,
                saved: mockUserData.saved,
            }),
        };

        firebaseFirestore.doc.mockReturnValueOnce('user-doc-ref');
        firebaseFirestore.getDoc.mockResolvedValueOnce(mockSnapshot);

        const result = await getUser(userId);

        expect(firebaseFirestore.doc).toHaveBeenCalledWith(db, 'users', userId);
        expect(firebaseFirestore.getDoc).toHaveBeenCalledWith('user-doc-ref');
        expect(result).toEqual(mockUserData);
    });

    it('getUser should return null if user document does not exist', async () => {
        const userId = 'non-existent-user';

        const mockSnapshot = {
            exists: jest.fn().mockReturnValue(false),
        };

        firebaseFirestore.doc.mockReturnValueOnce('user-doc-ref');
        firebaseFirestore.getDoc.mockResolvedValueOnce(mockSnapshot);
        console.log = jest.fn();

        const result = await getUser(userId);

        expect(console.log).toHaveBeenCalledWith('No such document!');
        expect(result).toBeNull();
    });

    it('getUser should return empty array on error', async () => {
        const userId = 'user-123';
        firebaseFirestore.doc.mockReturnValueOnce('user-doc-ref');
        firebaseFirestore.getDoc.mockRejectedValueOnce(new Error('Database error'));

        const result = await getUser(userId);

        expect(console.error).toHaveBeenCalled();
        expect(result).toEqual([]);
    });

    it('getPlacesByIds should return places for given IDs', async () => {
        const placeIds = ['place-1', 'place-2'];
        const mockPlaces = [
            { id: 'place-1', name: 'Place 1', location: { lat: 50.4501, lng: 30.5234 } },
            { id: 'place-2', name: 'Place 2', location: { lat: 49.8397, lng: 24.0297 } }
        ];

        const mockSnapshots = [
            {
                exists: jest.fn().mockReturnValue(true),
                id: 'place-1',
                data: jest.fn().mockReturnValue({
                    name: 'Place 1',
                    location: { lat: 50.4501, lng: 30.5234 }
                }),
            },
            {
                exists: jest.fn().mockReturnValue(true),
                id: 'place-2',
                data: jest.fn().mockReturnValue({
                    name: 'Place 2',
                    location: { lat: 49.8397, lng: 24.0297 }
                }),
            }
        ];

        firebaseFirestore.doc
            .mockReturnValueOnce('place-1-ref')
            .mockReturnValueOnce('place-2-ref');

        firebaseFirestore.getDoc
            .mockResolvedValueOnce(mockSnapshots[0])
            .mockResolvedValueOnce(mockSnapshots[1]);

        const result = await getPlacesByIds(placeIds);

        expect(firebaseFirestore.doc).toHaveBeenNthCalledWith(1, db, 'places', 'place-1');
        expect(firebaseFirestore.doc).toHaveBeenNthCalledWith(2, db, 'places', 'place-2');
        expect(firebaseFirestore.getDoc).toHaveBeenNthCalledWith(1, 'place-1-ref');
        expect(firebaseFirestore.getDoc).toHaveBeenNthCalledWith(2, 'place-2-ref');
        expect(result).toEqual(mockPlaces);
    });

    it('getPlacesByIds should return only existing places', async () => {
        const placeIds = ['place-1', 'non-existent-place'];

        const mockSnapshots = [
            {
                exists: jest.fn().mockReturnValue(true),
                id: 'place-1',
                data: jest.fn().mockReturnValue({
                    name: 'Place 1',
                    location: { lat: 50.4501, lng: 30.5234 }
                }),
            },
            {
                exists: jest.fn().mockReturnValue(false),
            }
        ];

        firebaseFirestore.doc
            .mockReturnValueOnce('place-1-ref')
            .mockReturnValueOnce('non-existent-place-ref');

        firebaseFirestore.getDoc
            .mockResolvedValueOnce(mockSnapshots[0])
            .mockResolvedValueOnce(mockSnapshots[1]);

        const result = await getPlacesByIds(placeIds);

        expect(result).toEqual([
            { id: 'place-1', name: 'Place 1', location: { lat: 50.4501, lng: 30.5234 } }
        ]);
    });

    it('getPlacesByIds should return empty array on error', async () => {
        const placeIds = ['place-1'];

        firebaseFirestore.doc.mockReturnValueOnce('place-1-ref');
        firebaseFirestore.getDoc.mockRejectedValueOnce(new Error('Database error'));

        const result = await getPlacesByIds(placeIds);

        expect(console.error).toHaveBeenCalled();
        expect(result).toEqual([]);
    });

    it('handleRegister should successfully register a user', async () => {
        const email = 'test@example.com';
        const password = 'password123';
        const name = 'Test User';
        const mockUid = 'new-user-uid';

        const mockUserCredential = {
            user: { uid: mockUid }
        };

        firebaseAuth.createUserWithEmailAndPassword.mockResolvedValueOnce(mockUserCredential);
        firebaseFirestore.doc.mockReturnValueOnce('user-doc-ref');
        firebaseFirestore.setDoc.mockResolvedValueOnce();
        console.log = jest.fn();

        await handleRegister(email, password, name);

        expect(firebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, email, password);
        expect(firebaseFirestore.doc).toHaveBeenCalledWith(db, 'users', mockUid);
        expect(firebaseFirestore.setDoc).toHaveBeenCalledWith('user-doc-ref', expect.objectContaining({
            name,
            email,
            uid: mockUid,
        }));
        expect(console.log).toHaveBeenCalledWith('User registered and saved');
    });

    it('handleRegister should handle registration error', async () => {
        const email = 'test@example.com';
        const password = 'password123';
        const name = 'Test User';
        const errorMsg = 'Email already in use';

        firebaseAuth.createUserWithEmailAndPassword.mockRejectedValueOnce(new Error(errorMsg));
        console.error = jest.fn();
        global.alert = jest.fn();

        await handleRegister(email, password, name);

        expect(firebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, email, password);
        expect(console.error).toHaveBeenCalled();
        expect(global.alert).toHaveBeenCalledWith(errorMsg);
    });

    it('getContributesByUser should return places contributed by user', async () => {
        const mockUser = {
            id: 'user-123',
            name: 'John Doe',
            contributes: ['place-1', 'place-3']
        };

        const mockPlaces = [
            { id: 'place-1', name: 'Place 1', location: { lat: 50.4501, lng: 30.5234 } },
            { id: 'place-2', name: 'Place 2', location: { lat: 49.8397, lng: 24.0297 } },
            { id: 'place-3', name: 'Place 3', location: { lat: 48.922633, lng: 24.711117 } },
        ];

        const mockSnapshot = {
            docs: mockPlaces.map(place => ({
                id: place.id,
                data: () => ({ name: place.name, location: place.location }),
            })),
        };

        firebaseFirestore.collection.mockReturnValueOnce('places-collection');
        firebaseFirestore.getDocs.mockResolvedValueOnce(mockSnapshot);

        const result = await getContributesByUser(mockUser);

        expect(firebaseFirestore.collection).toHaveBeenCalledWith(db, 'places');
        expect(firebaseFirestore.getDocs).toHaveBeenCalledWith('places-collection');

        expect(result).toEqual([
            { id: 'place-1', name: 'Place 1', location: { lat: 50.4501, lng: 30.5234 } },
            { id: 'place-3', name: 'Place 3', location: { lat: 48.922633, lng: 24.711117 } },
        ]);
    });

    it('getContributesByUser should return empty array if user has no contributions', async () => {
        const mockUser = { id: 'user-123', contributes: [] };
    
        const mockSnapshot = { docs: [] };
        firebaseFirestore.collection.mockReturnValueOnce('places-collection');
        firebaseFirestore.getDocs.mockResolvedValueOnce(mockSnapshot);
    
        const result = await getContributesByUser(mockUser);
    
        expect(result).toEqual([]);
    });

    it('getUser should return null when id is undefined', async () => {
        firebaseFirestore.doc.mockReturnValueOnce('user-doc-ref');
        firebaseFirestore.getDoc.mockResolvedValueOnce({ exists: jest.fn().mockReturnValue(false) });
    
        const result = await getUser(undefined);
    
        expect(result).toBeNull();
    });
    
    it('getReviewsById should handle invalid id gracefully', async () => {
        firebaseFirestore.collection.mockReturnValueOnce('reviews-collection');
        firebaseFirestore.getDocs.mockResolvedValueOnce({ docs: [] });
    
        const result = await getReviewsById(null);
    
        expect(result).toEqual([]);
    });
    
    it('getMarkers should handle empty snapshot', async () => {
        firebaseFirestore.collection.mockReturnValueOnce('places-collection');
        firebaseFirestore.getDocs.mockResolvedValueOnce({ docs: [] });
    
        const result = await getMarkers();
    
        expect(result).toEqual([]);
    });
    
    it('handleRegister should not call setDoc if createUser fails', async () => {
        const email = 'fail@example.com';
        const password = 'fail';
        const name = 'Fail User';
    
        firebaseAuth.createUserWithEmailAndPassword.mockRejectedValueOnce(new Error('Auth failed'));
        global.alert = jest.fn();
    
        await handleRegister(email, password, name);
    
        expect(firebaseFirestore.setDoc).not.toHaveBeenCalled();
        expect(global.alert).toHaveBeenCalledWith('Auth failed');
    });
    
    it('getUser should return user data even with empty contributes and visits', async () => {
        const userId = 'user-789';
        const mockSnapshot = {
            exists: jest.fn().mockReturnValue(true),
            id: userId,
            data: jest.fn().mockReturnValue({
                name: 'Empty User',
                email: 'empty@example.com',
                saved: [],
                contributes: [],
                visits: [],
            }),
        };
    
        firebaseFirestore.doc.mockReturnValueOnce('user-doc-ref');
        firebaseFirestore.getDoc.mockResolvedValueOnce(mockSnapshot);
    
        const result = await getUser(userId);
    
        expect(result).toEqual({
            id: userId,
            name: 'Empty User',
            email: 'empty@example.com',
            saved: [],
            contributes: [],
            visits: [],
        });
    });
    
    it('getPlacesByIds should skip over docs that return null data', async () => {
        const placeIds = ['place-1'];
    
        const mockSnapshot = {
            exists: jest.fn().mockReturnValue(true),
            id: 'place-1',
            data: jest.fn().mockReturnValue(null),
        };
    
        firebaseFirestore.doc.mockReturnValueOnce('place-1-ref');
        firebaseFirestore.getDoc.mockResolvedValueOnce(mockSnapshot);
    
        const result = await getPlacesByIds(placeIds);
    
        expect(result).toEqual([{ id: 'place-1' }]);
    });
    
    it('getReviewsById should return correct review structure', async () => {
        const placeId = 'place-test';
        const mockReviews = [
            { id: 'rev1', data: () => ({ text: 'Awesome!', rating: 5 }) },
        ];
    
        firebaseFirestore.collection.mockReturnValueOnce('reviews-collection');
        firebaseFirestore.getDocs.mockResolvedValueOnce({ docs: mockReviews });
    
        const result = await getReviewsById(placeId);
    
        expect(result).toEqual([{ id: 'rev1', text: 'Awesome!', rating: 5 }]);
    });
    
});
