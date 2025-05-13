// Supabase configuration
const SUPABASE_URL = 'https://rrzmoycmptojerlvusjf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyem1veWNtcHRvamVybHZ1c2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNDEyNDcsImV4cCI6MjA2MjcxNzI0N30.PoNZhSNOQT72rNhayId68GVzrQyQpVdxAkH3j8vTsdk';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Get DOM elements
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialize tasks array
let tasks = [];

// Current filter
let currentFilter = 'all';

// Add event listeners
document.addEventListener('DOMContentLoaded', async () => {
    await loadTasks();
    setupFilterListeners();
});

// Add task when Enter key is pressed
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Load tasks from Supabase
async function loadTasks() {
    try {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        tasks = data;
        renderTasks();
    } catch (error) {
        console.error('Error loading tasks:', error.message);
    }
}

// Add new task
async function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .insert([{ text: taskText, completed: false }])
                .select();

            if (error) throw error;
            
            tasks.unshift(data[0]);
            renderTasks();
            taskInput.value = '';
        } catch (error) {
            console.error('Error adding task:', error.message);
        }
    }
}

// Delete task
async function deleteTask(id) {
    try {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id);

        if (error) throw error;
        
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
    } catch (error) {
        console.error('Error deleting task:', error.message);
    }
}

// Toggle task completion
async function toggleTask(id) {
    try {
        const task = tasks.find(t => t.id === id);
        const { error } = await supabase
            .from('tasks')
            .update({ completed: !task.completed })
            .eq('id', id);

        if (error) throw error;
        
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        renderTasks();
    } catch (error) {
        console.error('Error updating task:', error.message);
    }
}

// Render tasks based on current filter
function renderTasks() {
    taskList.innerHTML = '';
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">מחק</button>
        `;

        const checkbox = li.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => toggleTask(task.id));

        taskList.appendChild(li);
    });
}

// Setup filter button listeners
function setupFilterListeners() {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            renderTasks();
        });
    });
} 