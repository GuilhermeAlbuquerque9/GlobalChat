import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
    getFirestore,
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// ======================================================
// Firebase
// ======================================================

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

// ======================================================
// TÓPICOS
// ======================================================

export async function getTopics() {

    const snapshot = await getDocs(

        query(

            collection(db, "topics"),

            orderBy("created", "desc")

        )

    );

    return snapshot.docs.map(document => ({

        id: document.id,

        ...document.data()

    }));

}

// ======================================================

export async function getTopic(topicId) {

    const snapshot = await getDoc(

        doc(db, "topics", topicId)

    );

    if (!snapshot.exists()) {

        return null;

    }

    return {

        id: snapshot.id,

        ...snapshot.data()

    };

}

// ======================================================

export async function createTopic(topic) {

    const ref = await addDoc(

        collection(db, "topics"),

        {

            title: topic.title,

            description: topic.description,

            age: Number(topic.age),

            owner: topic.owner,

            created: serverTimestamp()

        }

    );

    return ref.id;

}

// ======================================================

export async function updateTopic(
    topicId,
    title,
    description,
    age
) {

    await updateDoc(

        doc(db, "topics", topicId),

        {

            title,

            description,

            age: Number(age)

        }

    );

}

// ======================================================

export async function deleteTopic(topicId) {

    await deleteDoc(

        doc(db, "topics", topicId)

    );

}

// ======================================================
// MENSAGENS
// ======================================================

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

    return snapshot.docs.map(document => ({

        id: document.id,

        ...document.data()

    }));

}

// ======================================================

export async function sendMessage(
    topicId,
    user,
    text
) {

    const owner =

        localStorage.getItem("globalchat_userid");

    await addDoc(

        collection(
            db,
            "topics",
            topicId,
            "messages"
        ),

        {

            user: user || "Anônimo",

            text,

            owner,

            edited: false,

            created: serverTimestamp()

        }

    );

}

// ======================================================

export async function editMessage(
    topicId,
    messageId,
    text
) {

    await updateDoc(

        doc(
            db,
            "topics",
            topicId,
            "messages",
            messageId
        ),

        {

            text,

            edited: true

        }

    );

}

// ======================================================

export async function deleteMessage(
    topicId,
    messageId
) {

    await deleteDoc(

        doc(
            db,
            "topics",
            topicId,
            "messages",
            messageId
        )

    );

}
