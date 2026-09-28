import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Category, Task, Review, Earning, NotificationItem, UserRole, VerificationStatus } from '../types';
import { INITIAL_USERS, INITIAL_CATEGORIES, INITIAL_TASKS, INITIAL_REVIEWS, INITIAL_EARNINGS, BASE_CUSTOMER_COORDS } from '../data/mockData';
import { calculateDistanceKm } from '../utils/geo';

export interface HelperWithDistance extends User {
  distanceKm: number;
  isEligibleForCategory: boolean;
  exclusionReason?: 'too_far' | 'unverified_skill' | 'unavailable' | 'skill_mismatch';
}

interface AppContextType {
  currentUser: User;
  users: User[];
  categories: Category[];
  tasks: Task[];
  reviews: Review[];
  earnings: Earning[];
  notifications: NotificationItem[];
  activeNotificationToast: NotificationItem | null;
  switchUser: (userId: string) => void;
  switchRole: (role: UserRole) => void;
  updateUserAvailability: (helperId: string, isAvailable: boolean) => void;
  updateHelperProfile: (helperId: string, updates: Partial<User>) => void;
  verifyHelperCertificate: (helperId: string, status: VerificationStatus) => void;
  createTask: (newTask: Omit<Task, 'id' | 'createdAt' | 'status' | 'customerId' | 'customerName' | 'customerAvatar'>) => Task;
  assignHelper: (taskId: string, helperId: string) => void;
  startTask: (taskId: string) => void;
  markTaskCompleted: (taskId: string) => void;
  confirmTaskCompletion: (taskId: string) => void;
  rateTask: (taskId: string, rating: number, comment: string) => void;
  cancelTask: (taskId: string) => void;
  getCategoryById: (categoryId: string) => Category | undefined;
  getUserById: (userId: string) => User | undefined;
  getTaskById: (taskId: string) => Task | undefined;
  getNearbyHelpersForTask: (taskOrCategoryId: string | { latitude: number; longitude: number; categoryId: string }) => {
    eligible: HelperWithDistance[];
    excludedByDistance: HelperWithDistance[];
    excludedByVerification: HelperWithDistance[];
    allWithDistance: HelperWithDistance[];
  };
  requestMockPayout: (helperId: string, amount: number) => boolean;
  dismissToast: () => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'kaammate_current_user_id',
  USERS: 'kaammate_users_v1',
  TASKS: 'kaammate_tasks_v1',
  REVIEWS: 'kaammate_reviews_v1',
  EARNINGS: 'kaammate_earnings_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state or fallback to defaults
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved || 'user-jahnavi';
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [earnings, setEarnings] = useState<Earning[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EARNINGS);
    return saved ? JSON.parse(saved) : INITIAL_EARNINGS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeNotificationToast, setActiveNotificationToast] = useState<NotificationItem | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EARNINGS, JSON.stringify(earnings));
  }, [earnings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const addNotification = (title: string, message: string, type: NotificationItem['type'] = 'system', taskId?: string) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title,
      message,
      timestamp: 'Just now',
      read: false,
      taskId,
      type,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setActiveNotificationToast(newNotif);
  };

  const dismissToast = () => {
    setActiveNotificationToast(null);
  };

  const switchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUserId(userId);
      addNotification('Switched Account', `Logged in as ${target.name} (${target.role.toUpperCase()})`, 'system');
    }
  };

  const switchRole = (role: UserRole) => {
    if (role === 'customer') {
      switchUser('user-jahnavi');
    } else if (role === 'helper') {
      switchUser('helper-rahul');
    } else if (role === 'admin') {
      switchUser('user-admin');
    }
  };

  const updateUserAvailability = (helperId: string, isAvailable: boolean) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === helperId ? { ...u, isAvailable } : u))
    );
    addNotification('Availability Updated', `Status changed to ${isAvailable ? 'Available for tasks' : 'Unavailable'}`, 'system');
  };

  const updateHelperProfile = (helperId: string, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === helperId ? { ...u, ...updates } : u))
    );
    addNotification('Profile Saved', 'Helper profile details updated successfully.', 'system');
  };

  const verifyHelperCertificate = (helperId: string, status: VerificationStatus) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === helperId) {
          return {
            ...u,
            verificationStatus: status,
            certificateTitle: status === 'verified' ? `${u.certificateTitle?.replace('(Pending Admin Approval)', '') || 'Trade Certificate'} [Verified by Admin]` : u.certificateTitle,
          };
        }
        return u;
      })
    );
    const helper = users.find((u) => u.id === helperId);
    addNotification(
      'Admin Verification Decision',
      `Helper ${helper?.name || 'User'} has been marked as ${status.toUpperCase()}.`,
      'verification'
    );
  };

  const createTask = (
    taskData: Omit<Task, 'id' | 'createdAt' | 'status' | 'customerId' | 'customerName' | 'customerAvatar'>
  ): Task => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerAvatar: currentUser.avatar,
      createdAt: 'Just now',
      status: 'searching',
    };

    setTasks((prev) => [newTask, ...prev]);
    addNotification(
      'Task Broadcasted',
      `"${newTask.title}" is now active. Searching for verified helpers within 5 km.`,
      'task',
      newTask.id
    );
    return newTask;
  };

  const assignHelper = (taskId: string, helperId: string) => {
    const helper = users.find((u) => u.id === helperId);
    if (!helper) return;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: 'helper_assigned',
            assignedHelperId: helper.id,
            assignedHelperName: helper.name,
            assignedHelperAvatar: helper.avatar,
            assignedHelperRating: helper.rating,
            assignedHelperPhone: helper.phone,
          };
        }
        return t;
      })
    );

    addNotification(
      'Helper Assigned',
      `${helper.name} has been assigned to your task. They have received your request!`,
      'task',
      taskId
    );
  };

  const startTask = (taskId: string) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: 'in_progress',
            startedAt: `Today, ${now}`,
          };
        }
        return t;
      })
    );
    addNotification('Task Started', 'Helper has arrived/started working on this task.', 'task', taskId);
  };

  const markTaskCompleted = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: 'pending_confirmation',
          };
        }
        return t;
      })
    );
    addNotification(
      'Work Completed by Helper',
      'The helper has marked the task done. Please confirm completion to release payment.',
      'task',
      taskId
    );
  };

  const confirmTaskCompletion = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !task.assignedHelperId) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const todayDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    // Update task
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: 'completed',
            completedAt: `Today, ${now}`,
            isPaid: true,
          };
        }
        return t;
      })
    );

    // Create mock earning record for helper
    const newEarning: Earning = {
      id: `earn-${Date.now()}`,
      helperId: task.assignedHelperId,
      taskId: task.id,
      taskTitle: task.title,
      categoryName: task.categoryName,
      customerName: task.customerName,
      amount: task.budget,
      date: todayDate,
      status: 'credited',
      paymentMethod: 'KaamMate Instant Escrow (Simulated)',
    };
    setEarnings((prev) => [newEarning, ...prev]);

    // Update helper balances and task count
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === task.assignedHelperId) {
          return {
            ...u,
            completedTasksCount: (u.completedTasksCount || 0) + 1,
            earningsToday: (u.earningsToday || 0) + task.budget,
            earningsWeek: (u.earningsWeek || 0) + task.budget,
            earningsTotal: (u.earningsTotal || 0) + task.budget,
          };
        }
        return u;
      })
    );

    addNotification(
      'Payment Released',
      `₹${task.budget} credited to ${task.assignedHelperName}. Please rate your experience!`,
      'payment',
      taskId
    );
  };

  const rateTask = (taskId: string, rating: number, comment: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !task.assignedHelperId) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      taskId,
      taskTitle: task.title,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerAvatar: currentUser.avatar,
      helperId: task.assignedHelperId,
      rating,
      comment,
      createdAt: 'Just now',
    };

    setReviews((prev) => [newReview, ...prev]);

    // Update task flag
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, customerRated: true } : t))
    );

    // Recompute helper rating
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === task.assignedHelperId) {
          const currentReviews = reviews.filter((r) => r.helperId === u.id);
          const totalScore = currentReviews.reduce((acc, r) => acc + r.rating, 0) + rating;
          const count = currentReviews.length + 1;
          const newAvg = Math.round((totalScore / count) * 10) / 10;
          return {
            ...u,
            rating: newAvg,
            reviewCount: count,
          };
        }
        return u;
      })
    );

    addNotification('Review Published', `Thank you! Your ${rating}-star rating has been added to the helper's profile.`, 'system');
  };

  const cancelTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'cancelled' } : t))
    );
    addNotification('Task Cancelled', 'Task has been cancelled.', 'task', taskId);
  };

  const getCategoryById = (categoryId: string) => {
    return INITIAL_CATEGORIES.find((c) => c.id === categoryId);
  };

  const getUserById = (userId: string) => {
    return users.find((u) => u.id === userId);
  };

  const getTaskById = (taskId: string) => {
    return tasks.find((t) => t.id === taskId);
  };

  /**
   * 5 KM Nearby Helper Matcher & Filter
   */
  const getNearbyHelpersForTask = (
    taskOrCategoryInput: string | { latitude: number; longitude: number; categoryId: string }
  ) => {
    let lat = BASE_CUSTOMER_COORDS.latitude;
    let lon = BASE_CUSTOMER_COORDS.longitude;
    let catId = 'shopping-delivery';

    if (typeof taskOrCategoryInput === 'string') {
      const task = tasks.find((t) => t.id === taskOrCategoryInput);
      if (task) {
        lat = task.latitude;
        lon = task.longitude;
        catId = task.categoryId;
      } else {
        catId = taskOrCategoryInput;
      }
    } else {
      lat = taskOrCategoryInput.latitude;
      lon = taskOrCategoryInput.longitude;
      catId = taskOrCategoryInput.categoryId;
    }

    const category = getCategoryById(catId);
    const isSkilledCategory = category?.isSkilled ?? false;

    const allHelpers = users.filter((u) => u.role === 'helper');

    const helpersWithDistance: HelperWithDistance[] = allHelpers.map((helper) => {
      const distance = calculateDistanceKm(lat, lon, helper.latitude, helper.longitude);
      const hasSkill = helper.skills?.includes(catId) || false;
      const isWithin5Km = distance <= 5.0;
      const isVerified = helper.verificationStatus === 'verified';
      const isAvail = helper.isAvailable !== false;

      let isEligible = false;
      let exclusionReason: HelperWithDistance['exclusionReason'] = undefined;

      if (!hasSkill) {
        exclusionReason = 'skill_mismatch';
      } else if (!isWithin5Km) {
        exclusionReason = 'too_far';
      } else if (isSkilledCategory && !isVerified) {
        exclusionReason = 'unverified_skill';
      } else if (!isAvail) {
        exclusionReason = 'unavailable';
      } else {
        isEligible = true;
      }

      return {
        ...helper,
        distanceKm: distance,
        isEligibleForCategory: isEligible,
        exclusionReason,
      };
    });

    // Sort by distance ascending
    helpersWithDistance.sort((a, b) => a.distanceKm - b.distanceKm);

    const eligible = helpersWithDistance.filter((h) => h.isEligibleForCategory);
    const excludedByDistance = helpersWithDistance.filter(
      (h) => h.skills?.includes(catId) && h.distanceKm > 5.0
    );
    const excludedByVerification = helpersWithDistance.filter(
      (h) => h.skills?.includes(catId) && h.distanceKm <= 5.0 && h.exclusionReason === 'unverified_skill'
    );

    return {
      eligible,
      excludedByDistance,
      excludedByVerification,
      allWithDistance: helpersWithDistance,
    };
  };

  const requestMockPayout = (helperId: string, amount: number): boolean => {
    const helper = users.find((u) => u.id === helperId);
    if (!helper || (helper.earningsTotal || 0) < amount) {
      addNotification('Payout Failed', 'Insufficient balance in wallet.', 'payment');
      return false;
    }

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === helperId) {
          return {
            ...u,
            earningsTotal: Math.max(0, (u.earningsTotal || 0) - amount),
          };
        }
        return u;
      })
    );

    addNotification(
      'Simulated Payout Successful',
      `₹${amount} has been mock-transferred to ${helper.name}'s linked bank account/UPI.`,
      'payment'
    );
    return true;
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.EARNINGS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);

    setUsers(INITIAL_USERS);
    setTasks(INITIAL_TASKS);
    setReviews(INITIAL_REVIEWS);
    setEarnings(INITIAL_EARNINGS);
    setCurrentUserId('user-jahnavi');
    addNotification('Demo Data Reset', 'Platform restored to initial sample state.', 'system');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        categories: INITIAL_CATEGORIES,
        tasks,
        reviews,
        earnings,
        notifications,
        activeNotificationToast,
        switchUser,
        switchRole,
        updateUserAvailability,
        updateHelperProfile,
        verifyHelperCertificate,
        createTask,
        assignHelper,
        startTask,
        markTaskCompleted,
        confirmTaskCompletion,
        rateTask,
        cancelTask,
        getCategoryById,
        getUserById,
        getTaskById,
        getNearbyHelpersForTask,
        requestMockPayout,
        dismissToast,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
