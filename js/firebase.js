import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
    getFirestore,
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// =====================================================
// Firebase
// =====================================================

const firebaseConfig = {

    apiKey: "AIzaSyBfob1E-FeUl8rh3ZKuLgijEtSTgoCmJK8",

    authDomain: "globalchat-0.firebaseapp.com",

    projectId: "globalchat-0",

    storageBucket: "globalchat-0.firebasestorage.app",

    messagingSenderId: "1065764966368",

    appId: "1:1065764966368:web:20ea567cf91d9d57e26585"

};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// =====================================================

export async function getTopics() {

    const snapshot = await getDocs(
        query(
            collection(db, "topics"),
            orderBy("created", "desc")
        )
    );

    return snapshot.docs.map(doc => ({

        id: doc.id,

        ...doc.data()

    }));

}

// =====================================================

export async function getTopic(id) {

    const snapshot = await getDoc(
        doc(db, "topics", id)
    );

    if (!snapshot.exists()) {

        return null;

    }

    return {

        id: snapshot.id,

        ...snapshot.data()

    };

}

// =====================================================

export async function createTopic(topic) {

    const ref = await addDoc(
        collection(db, "topics"),
        {

            title: topic.title,

            description: topic.description,

            age: Number(topic.age),

            created: serverTimestamp()

        }
    );

    return ref.id;

}

// =====================================================

export async function getMessages(topicId) {

    const snapshot = await getDocs(

        query(

            collection(
                db,
                "topics",
                topicId,
                "messages"
            ),

            orderBy("created")

        )

    );

    return snapshot.docs.map(doc => ({

        id: doc.id,

        ...doc.data()

    }));

}

// =====================================================

export async function sendMessage(topicId, user, text) {

    await addDoc(

        collection(
            db,
            "topics",
            topicId,
            "messages"
        ),

        {

            user,

            text,

            created: serverTimestamp()

        }

    );

}
