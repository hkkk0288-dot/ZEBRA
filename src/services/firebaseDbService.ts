import {
  collection,
  doc,
  getDocs,
  getDocFromServer,
  setDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { AdminUserRecord } from '../components/admin/adminMockData';
import { MenuItem, TableOrder } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

// Test Connection on boot
export async function testFirestoreConnection() {
  try {
    if (db) {
      await getDocFromServer(doc(db, 'test', 'connection'));
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore notice: Client is offline or establishing connection.");
    }
  }
}

// -------------------------------------------------------------
// USERS COLLECTION FIRESTORE METHODS
// -------------------------------------------------------------
const USERS_COLLECTION = 'users';

export async function fetchUsersFromFirestore(): Promise<AdminUserRecord[] | null> {
  if (!db) return null;
  try {
    const snap = await getDocs(collection(db, USERS_COLLECTION));
    if (snap.empty) return null;
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as AdminUserRecord));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, USERS_COLLECTION);
    return null;
  }
}

export async function saveUserToFirestore(user: AdminUserRecord): Promise<boolean> {
  if (!db) return false;
  const path = `${USERS_COLLECTION}/${user.id}`;
  try {
    await setDoc(doc(db, USERS_COLLECTION, user.id), {
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      ordersCount: user.ordersCount || 0,
      totalSpent: user.totalSpent || 0,
      joinedDate: user.joinedDate || new Date().toISOString(),
      avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      assignedBranch: user.assignedBranch || 'Central Branch',
      tempPassword: user.tempPassword || '',
      permissions: user.permissions || {
        canTakeOrders: user.role === 'Waiter' || user.role === 'Super Admin',
        canViewKitchen: user.role === 'Waiter' || user.role === 'Kitchen Manager' || user.role === 'Super Admin',
        canManageProducts: user.role === 'Super Admin' || user.role === 'Kitchen Manager',
        canDispatchRiders: user.role === 'Super Admin' || user.role === 'Dispatcher',
        canManageUsers: user.role === 'Super Admin',
        canViewFinancials: user.role === 'Super Admin',
        canManageSettings: user.role === 'Super Admin'
      },
      updatedAt: Date.now()
    }, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

export async function deleteUserFromFirestore(userId: string): Promise<boolean> {
  if (!db) return false;
  const path = `${USERS_COLLECTION}/${userId}`;
  try {
    await deleteDoc(doc(db, USERS_COLLECTION, userId));
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    return false;
  }
}

// -------------------------------------------------------------
// PRODUCTS / MENU ITEMS COLLECTION FIRESTORE METHODS
// -------------------------------------------------------------
const PRODUCTS_COLLECTION = 'products';

export async function fetchProductsFromFirestore(): Promise<MenuItem[] | null> {
  if (!db) return null;
  try {
    const snap = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (snap.empty) return null;
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as MenuItem));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, PRODUCTS_COLLECTION);
    return null;
  }
}

export async function saveProductToFirestore(item: MenuItem): Promise<boolean> {
  if (!db) return false;
  const path = `${PRODUCTS_COLLECTION}/${item.id}`;
  try {
    await setDoc(doc(db, PRODUCTS_COLLECTION, item.id), item, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

export async function deleteProductFromFirestore(productId: string): Promise<boolean> {
  if (!db) return false;
  const path = `${PRODUCTS_COLLECTION}/${productId}`;
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    return false;
  }
}

// -------------------------------------------------------------
// TABLE ORDERS (WAITER TERMINAL) FIRESTORE METHODS
// -------------------------------------------------------------
const TABLE_ORDERS_COLLECTION = 'table_orders';

export async function fetchTableOrdersFromFirestore(): Promise<TableOrder[] | null> {
  if (!db) return null;
  try {
    const snap = await getDocs(collection(db, TABLE_ORDERS_COLLECTION));
    if (snap.empty) return null;
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as TableOrder));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, TABLE_ORDERS_COLLECTION);
    return null;
  }
}

export async function saveTableOrderToFirestore(order: TableOrder): Promise<boolean> {
  if (!db) return false;
  const path = `${TABLE_ORDERS_COLLECTION}/${order.id}`;
  try {
    await setDoc(doc(db, TABLE_ORDERS_COLLECTION, order.id), order, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

export async function updateTableOrderStatusInFirestore(
  orderId: string,
  status: TableOrder['status']
): Promise<boolean> {
  if (!db) return false;
  const path = `${TABLE_ORDERS_COLLECTION}/${orderId}`;
  try {
    await setDoc(doc(db, TABLE_ORDERS_COLLECTION, orderId), { status, updatedAt: Date.now() }, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    return false;
  }
}

// Real-time listener for table orders (for Waiter POS and Kitchen KDS)
export function subscribeToTableOrders(callback: (orders: TableOrder[]) => void) {
  if (!db) return () => {};
  try {
    return onSnapshot(collection(db, TABLE_ORDERS_COLLECTION), snap => {
      const orders = snap.docs.map(d => ({ id: d.id, ...d.data() } as TableOrder));
      callback(orders);
    }, error => {
      handleFirestoreError(error, OperationType.GET, TABLE_ORDERS_COLLECTION);
    });
  } catch (err) {
    console.warn("Could not subscribe to table orders in real-time:", err);
    return () => {};
  }
}
