/* eslint-disable @next/next/no-img-element */

"use client";

import React, { useState, useEffect } from 'react';
import UserPostClient from './otherUserPostClient';


export default function OtherPostCard(userId) {
    return (
        <UserPostClient userId={userId} />
    );
};
          