import numpy as np
import tensorflow as tf
import pandas as pd
import numpy as np
import csv
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics import jaccard_score
import random
import copy


def neuron(students_data, projects_data, students_score, student_id):

    unique_skills_students = sorted(
        set(skill for skills_list in students_data for skill in skills_list))
    students_skills = {skill: index for index,
                       skill in enumerate(unique_skills_students)}

    unique_skills_projects = sorted(
        set(skill for skills_list in projects_data for skill in skills_list))

    # all_unique_skills = sorted(set(unique_skills_students + unique_skills_projects))
    # universal_skills_mapping = {skill: index for index, skill in enumerate(all_unique_skills)}
    all_unique_skills = sorted(set(
        skill for skills_list in students_data + projects_data for skill in skills_list))
    universal_skills_mapping = {
        skill: index for index, skill in enumerate(all_unique_skills)}

    # def skills_to_vector(skills_list, skills_mapping, score):
    #     vector = np.zeros(len(skills_mapping) + 1)
    #     for skill in skills_list:
    #         vector[skills_mapping[skill]] = 1
    #     vector[-1] = score
    #     return vector

    def skills_to_vector(skills_list, skills_mapping, score):
        vector = np.zeros(len(skills_mapping) + 1)
        for skill in skills_list:
            if skill in skills_mapping:
                vector[skills_mapping[skill]] = 1
        vector[-1] = score  # Добавляем средний балл в последний элемент вектора
        return vector

    students_data_vectors = np.array([skills_to_vector(
        student, universal_skills_mapping, score) for student, score in zip(students_data, students_score)])
    projects_data_vectors = np.array([skills_to_vector(
        project, universal_skills_mapping, 0) for project in projects_data])

    # print()
    # print(students_skills)
    print(universal_skills_mapping)

    # добавляем один для учета среднего балла
    input_dim = len(all_unique_skills) + 1
    model = tf.keras.Sequential([
        tf.keras.layers.Dense(64, activation='relu', input_shape=(input_dim,)),
        tf.keras.layers.Dense(64, activation='relu'),
        tf.keras.layers.Dense(128, activation='relu'),
        tf.keras.layers.Dense(64, activation='relu'),
        tf.keras.layers.Dense(len(projects_data), activation='softmax')
    ])

    def skill_match_reward(student_skills, project_skills):
        student_skills = np.array(student_skills).reshape(1, -1)
        project_skills = np.array(project_skills).reshape(1, -1)

        similarity = cosine_similarity(student_skills, project_skills)[0][0]
        return k * similarity

    def discounted_rewards(rewards, gamma):
        discounted = np.zeros_like(rewards)
        running_add = 0
        for t in reversed(range(0, len(rewards))):
            running_add = running_add * gamma + rewards[t]
            discounted[t] = running_add
        return discounted

    model.compile(optimizer='adam')

    k = 0.9
    gamma = 0.99
    num_iterations = 100

    team_projects = {i: [] for i in range(len(projects_data))}
    team_sizes = {i: 0 for i in range(len(projects_data))}
    team_scores = {i: [] for i in range(len(projects_data))}
    teamst = {i: [] for i in range(len(projects_data))}

    num_teams = len(projects_data)

    max_team_size = len(students_data) // len(projects_data)

    team_extra = {i: [] for i in range(len(projects_data))}
    extra_students = len(students_data) % len(
        projects_data)  # последние несколько студентов
    counter = 0
    last_student = student_id[-extra_students:]
    last_scores_student = students_score[-extra_students:]
    # if если пустой то ничего, если нет то добавляем студентов
    print(last_student)
    print(last_scores_student)
    optimizer = tf.keras.optimizers.Adam()

    for _ in range(num_iterations):
        with tf.GradientTape() as tape:
            total_loss = 0
            rewards = []
            batch_states = []

            unassigned_students = list(range(len(students_data)))

            for i in range(len(students_data)):
                state = students_data_vectors[i]
                state_tensor = tf.convert_to_tensor(state, dtype=tf.float32)
                batch_states.append(state_tensor)

            batch_states = tf.stack(batch_states)
            action_prob = model(batch_states)

            for i in range(len(students_data)):
                projects_action_scores = []
                for j in range(len(projects_data_vectors)):
                    projects_action = projects_data_vectors[j][:len(
                        students_data_vectors[i])]
                    if len(projects_action) != len(students_data_vectors[i]):
                        diff_len = len(
                            students_data_vectors[i]) - len(projects_action)
                        projects_action = np.append(
                            projects_action, np.zeros(diff_len))

                    score = skill_match_reward(
                        students_data_vectors[i], projects_action)
                    projects_action_scores.append(score)

                action = np.argmax(projects_action_scores)

                if action not in team_projects:
                    team_projects[action] = []
                    team_sizes[action] = 0
                    team_scores[action] = []

                    teamst[action] = []

                if team_sizes[action] < max_team_size:
                    team_projects[action].append(students_data[i])
                    team_sizes[action] += 1
                    team_scores[action].append(students_score[i])

                    teamst[action].append(student_id[i])

                    unassigned_students.remove(i)
                else:
                    avg_team_score = np.mean(team_scores[action])
                    weak_team_index = min(team_scores, key=team_scores.get)
                    weak_team_score = np.mean(team_scores[weak_team_index])

                    if avg_team_score < weak_team_score:
                        if weak_team_index not in team_projects:
                            team_projects[weak_team_index] = []
                            team_sizes[weak_team_index] = 0
                            team_scores[weak_team_index] = []

                            teamst[weak_team_index] = []

                        if team_sizes[weak_team_index] < max_team_size:
                            team_projects[weak_team_index].append(
                                students_data[i])
                            team_sizes[weak_team_index] += 1

                            team_scores[weak_team_index].append(
                                students_score[i])

                            teamst[weak_team_index].append(student_id[i])

                            unassigned_students.remove(i)

                reward = projects_action_scores[action]
                rewards.append(reward)
                loss = -tf.math.log(action_prob[i][action]) * reward
                total_loss += loss

            if unassigned_students:
                for student in unassigned_students:
                    eligible_teams = [team_idx for team_idx in range(
                        num_teams) if team_sizes[team_idx] < max_team_size]
                    if eligible_teams:
                        weakest_team_index = min(
                            eligible_teams, key=lambda k: np.mean(team_scores[k]))
                        student_skills = students_data[student]
                        team_projects[weakest_team_index].append(
                            student_skills)
                        team_sizes[weakest_team_index] += 1
                        team_scores[weakest_team_index].append(
                            students_score[student])

                        teamst[weakest_team_index].append(student_id[student])

            # print(team_extra)
            # print(team_scores)

            if extra_students > 0:
                for st in range(len(last_student)):
                    if counter < extra_students:
                        weakest_team_index = min(
                            team_scores, key=lambda k: np.mean(team_scores[k]))

                        team_scores[weakest_team_index].append(
                            last_scores_student[st])
                        team_extra[weakest_team_index].append(last_student[st])
                        counter += 1
                    else:
                        continue

            discounted = discounted_rewards(rewards, gamma)
            total_loss *= discounted
            gradients = tape.gradient(total_loss, model.trainable_variables)
            optimizer.apply_gradients(
                zip(gradients, model.trainable_variables))

        print(f"Iteration: {_+1}/{num_iterations}")

    merged_dict = {}

    for key in set(teamst.keys()) | set(team_extra.keys()):
        merged_dict[key] = teamst.get(key, []) + team_extra.get(key, [])

    print(merged_dict)

    print(f"Экстра команда: {team_extra}")
    print(f"баллы: {team_scores}")
    # print(team_projects)
    # print(teamst)
    # print(team_scores)
    print(team_projects)
    # return teamst
    return merged_dict
